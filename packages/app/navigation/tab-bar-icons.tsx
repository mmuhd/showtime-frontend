import { View, Pressable, Button } from "design-system";
import { tw } from "design-system/tailwind";
import {
  Home,
  HomeFilled,
  Compass,
  CompassFilled,
  Hot,
  HotFilled,
  Bell,
  BellFilled,
  Plus,
} from "design-system/icon";
import { useRouter } from "app/navigation/use-router";

function TabBarIcon({ tab, children }) {
  const router = useRouter();

  return (
    <Pressable
      tw={[
        "md:bg-white md:dark:bg-gray-800 rounded-[20] w-12 h-12 items-center justify-center",
      ]}
      // @ts-expect-error web only
      onMouseEnter={() => {
        router.prefetch(tab);
      }}
      onPress={() => {
        router.push(tab);
      }}
      // animate={useCallback(({ hovered }) => {
      // 	'worklet'

      // 	return hovered
      // 		? tw.style('bg-gray-100 dark:bg-gray-800 md:dark:bg-gray-700')
      // 		: tw.style('bg-white dark:bg-gray-900 md:dark:bg-gray-800')
      // }, [])}
    >
      {children}
    </Pressable>
  );
}

export const HomeTabBarIcon = ({ color, focused }) => {
  return (
    <TabBarIcon tab="/">
      {focused ? (
        <View tw="rounded-[20] w-10 h-10 items-center justify-center">
          <HomeFilled
            style={tw.style("z-1")}
            width={24}
            height={24}
            color={color}
          />
        </View>
      ) : (
        <Home style={tw.style("z-1")} width={24} height={24} color={color} />
      )}
    </TabBarIcon>
  );
};

export const MarketplaceTabBarIcon = ({ color, focused }) => {
  return (
    <TabBarIcon tab="/marketplace">
      {focused ? (
        <View tw="rounded-[20] w-10 h-10 items-center justify-center">
          <CompassFilled
            style={tw.style("z-1")}
            width={24}
            height={24}
            color={color}
          />
        </View>
      ) : (
        <Compass style={tw.style("z-1")} width={24} height={24} color={color} />
      )}
    </TabBarIcon>
  );
};

export const CameraTabBarIcon = ({ color, focused }) => {
  return (
    <TabBarIcon tab="/camera">
      <Button
        variant="primary"
        tw={[
          "rounded-full h-12 w-12",
          focused ? "bg-gray-100 dark:bg-gray-900" : "",
        ]}
      >
        <Plus
          width={24}
          height={24}
          color={
            tw.style(
              focused ? "bg-black dark:bg-white" : "bg-white dark:bg-black"
            )?.backgroundColor as string
          }
        />
      </Button>
    </TabBarIcon>
  );
};

export const TrendingTabBarIcon = ({ color, focused }) => {
  return (
    <TabBarIcon tab="/trending">
      {focused ? (
        <View tw="rounded-[20] w-10 h-10 items-center justify-center">
          <HotFilled
            style={tw.style("z-1")}
            width={24}
            height={24}
            color={color}
          />
        </View>
      ) : (
        <Hot style={tw.style("z-1")} width={24} height={24} color={color} />
      )}
    </TabBarIcon>
  );
};

export const NotificationsTabBarIcon = ({ color, focused }) => {
  return (
    <TabBarIcon tab="/notifications">
      {focused ? (
        <View tw="rounded-[20] w-10 h-10 items-center justify-center">
          <BellFilled
            style={tw.style("z-1")}
            width={24}
            height={24}
            color={color}
          />
        </View>
      ) : (
        <Bell style={tw.style("z-1")} width={24} height={24} color={color} />
      )}
    </TabBarIcon>
  );
};
