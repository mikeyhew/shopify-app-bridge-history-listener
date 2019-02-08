
import {ClientApplication} from "@shopify/app-bridge";
import {History as AppBridgeHistory} from "@shopify/app-bridge/actions";
import {LocationListener} from "history";

const QUERY_FILTER_REGEX = /(^|&)(timestamp|protocol|hmac|shop|locale)=[^&]*/g;

function filterQueryString(queryString: string): string {
  if (queryString.length > 0) {
    return "?" + queryString.slice(1).replace(QUERY_FILTER_REGEX, "");
  } else {
    return "";
  }
}

export default function createListener<S>(appBridge: ClientApplication<S>): LocationListener {
  const appBridgeHistory = AppBridgeHistory.create(appBridge);

  return (location) => {
    const {pathname, search, hash} = location;

    const path = pathname + filterQueryString(search) + hash;

    appBridgeHistory.dispatch(AppBridgeHistory.Action.REPLACE, path);
  };
}
