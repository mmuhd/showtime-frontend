import { useEffect, useMemo, ReactNode, useRef } from "react";
import { Platform, InteractionManager } from "react-native";

import useSWR from "swr";

import { useRouter } from "@showtime-xyz/universal.router";

import { UserContext } from "app/context/user-context";
import { useAuth } from "app/hooks/auth/use-auth";
import { axios } from "app/lib/axios";
import { registerForPushNotificationsAsync } from "app/lib/register-push-notification";
import { useRudder } from "app/lib/rudderstack";
import { MyInfo } from "app/types";
import { userHasIncompleteExternalLinks } from "app/utilities";

interface UserProviderProps {
  children: ReactNode;
}

export const MY_INFO_ENDPOINT = "/v2/myinfo";

export function UserProvider({ children }: UserProviderProps) {
  //#region hooks
  const { rudder } = useRudder();
  const { authenticationStatus, accessToken } = useAuth();
  const router = useRouter();

  const { data, error, mutate } = useSWR<MyInfo>(
    accessToken ? MY_INFO_ENDPOINT : null,
    (url) => axios({ url, method: "GET" })
  );
  //#endregion
  //#region refs
  const isFirstLoad = useRef(true);
  //#endregion
  //#region variables
  const isLoading =
    authenticationStatus === "IDLE" ||
    authenticationStatus === "REFRESHING" ||
    (authenticationStatus === "AUTHENTICATED" && !error && !data);

  const isIncompletedProfile = data?.data
    ? !data?.data.profile.username ||
      userHasIncompleteExternalLinks(data?.data.profile) ||
      !data?.data.profile.bio ||
      !data?.data.profile.img_url
    : undefined;

  const userContextValue = useMemo(
    () => ({
      user: data,
      mutate,
      error,
      isLoading,
      isAuthenticated: accessToken != undefined,
      isIncompletedProfile,
    }),
    [data, mutate, error, isLoading, accessToken, isIncompletedProfile]
  );
  //#endregion

  //#region effects
  useEffect(() => {
    if (
      authenticationStatus === "AUTHENTICATED" ||
      authenticationStatus === "UNAUTHENTICATED"
    ) {
      mutate();
    }
    if (authenticationStatus === "AUTHENTICATED" && isFirstLoad.current) {
      setTimeout(() => {
        InteractionManager.runAfterInteractions(() => {
          if (isIncompletedProfile === true) {
            router.push(
              Platform.select({
                native: "/profile/complete",
                web: {
                  pathname: router.pathname,
                  query: {
                    ...router.query,
                    completeProfileModal: true,
                  },
                } as any,
              }),
              Platform.select({
                native: "/profile/complete",
                web: router.asPath,
              })
            );
            isFirstLoad.current = false;
          }
        });
      }, 1000);
    }
    if (authenticationStatus === "UNAUTHENTICATED") {
      isFirstLoad.current = true;
    }
  }, [authenticationStatus, isIncompletedProfile, mutate, router]);

  useEffect(() => {
    const identifyAndRegisterPushNotification = async () => {
      if (data) {
        const LogRocket = (await import("app/lib/logrocket")).default;

        // Identify user
        LogRocket.identify(data.data.profile.profile_id.toString());
        rudder?.identify(data.data.profile.profile_id.toString(), {});

        LogRocket.getSessionURL((sessionURL: string) => {
          if (
            sessionURL !== "Session quota exceeded. Please upgrade your plan."
          ) {
            rudder?.track("LogRocket", { sessionURL: sessionURL });
            // Sentry.configureScope(scope => {
            //   scope.setExtra("sessionURL", sessionURL);
            // });
          }
        });

        // Handle registration for push notification
        if (Platform.OS !== "web") {
          await registerForPushNotificationsAsync();
        }
      }
    };

    identifyAndRegisterPushNotification();
  }, [data, rudder]);
  //#endregion

  return (
    <UserContext.Provider value={userContextValue}>
      {children}
    </UserContext.Provider>
  );
}
