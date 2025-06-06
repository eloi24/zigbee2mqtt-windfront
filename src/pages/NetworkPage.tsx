import { faCircleInfo, faDownLong, faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type ChangeEvent, lazy, useCallback, useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { WebSocketApiRouterContext } from "../WebSocketApiRouterContext.js";
import Button from "../components/Button.js";
import CheckboxField from "../components/form-fields/CheckboxField.js";
import SelectField from "../components/form-fields/SelectField.js";
import type { DisplayType, MapType } from "../components/network-page/index.js";
import { useAppDispatch, useAppSelector } from "../hooks/useApp.js";
import { setNetworkMapIsLoading } from "../store.js";

const RawNetworkData = lazy(async () => await import("../components/network-page/RawNetworkData.js"));
const RawNetworkMap = lazy(async () => await import("../components/network-page/RawNetworkMap.js"));

export default function NetworkPage() {
    const dispatch = useAppDispatch();
    const { sendMessage } = useContext(WebSocketApiRouterContext);
    const { t } = useTranslation(["network", "common"]);
    const networkMapIsLoading = useAppSelector((state) => state.networkMapIsLoading);
    const networkMap = useAppSelector((state) => state.networkMap);
    const [mapType, setMapType] = useState<MapType>("raw");
    const [enableRoutes, setEnableRoutes] = useState(false);
    const [displayType, setDisplayType] = useState<DisplayType>("data");

    const onMapTypeChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
        if (event.target.value) {
            setMapType(event.target.value as MapType);
        }
    }, []);

    const onDisplayTypeChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
        if (event.target.value) {
            setDisplayType(event.target.value as DisplayType);
        }
    }, []);

    const onEnableRoutesChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setEnableRoutes(event.target.checked);
    }, []);

    const onRequestClick = useCallback(async () => {
        dispatch(setNetworkMapIsLoading());
        await sendMessage("bridge/request/networkmap", { type: mapType, routes: enableRoutes });
    }, [mapType, enableRoutes, dispatch, sendMessage]);

    const content = useMemo(() => {
        if (networkMapIsLoading) {
            return (
                <>
                    <div className="flex flex-row justify-center items-center gap-2">
                        <span className="loading loading-infinity loading-xl" />
                    </div>
                    <div className="flex flex-row justify-center items-center gap-2">{t("loading")}</div>
                </>
            );
        }

        if (networkMap) {
            switch (networkMap.type) {
                case "raw": {
                    return displayType === "data" ? <RawNetworkData map={networkMap.value} /> : <RawNetworkMap map={networkMap.value} />;
                }
                case "graphviz": {
                    return (
                        <>
                            <div className="alert alert-info alert-soft mb-3" role="alert">
                                <FontAwesomeIcon icon={faCircleInfo} size="2xl" />
                                {t("copy_paste_on")}
                                <a href="https://dreampuf.github.io/GraphvizOnline" target="_blank" rel="noreferrer" className="link link-hover">
                                    https://dreampuf.github.io/GraphvizOnline
                                </a>
                                <a href="https://edotor.net/" target="_blank" rel="noreferrer" className="link link-hover">
                                    https://edotor.net/
                                </a>
                            </div>
                            <textarea className="textarea w-full" rows={5} readOnly value={networkMap.value} />
                        </>
                    );
                }
                case "plantuml": {
                    return (
                        <>
                            <div className="alert alert-info alert-soft mb-3" role="alert">
                                <FontAwesomeIcon icon={faCircleInfo} size="2xl" />
                                {t("copy_paste_on")}
                                <a href="https://editor.plantuml.com/uml/" target="_blank" rel="noreferrer" className="link link-hover">
                                    https://editor.plantuml.com/uml/
                                </a>
                                <a href="https://www.planttext.com/" target="_blank" rel="noreferrer" className="link link-hover">
                                    https://www.planttext.com/
                                </a>
                            </div>
                            <textarea className="textarea w-full" rows={5} readOnly value={networkMap.value} />
                        </>
                    );
                }
            }
        }

        return null;
    }, [networkMap, networkMapIsLoading, displayType, t]);

    return (
        <>
            <div className="flex flex-row justify-center gap-3 mb-3">
                <SelectField name="type" label={t("type")} value={mapType} onChange={onMapTypeChange}>
                    <option value="raw">raw</option>
                    <option value="graphviz">graphviz</option>
                    <option value="plantuml">plantuml</option>
                </SelectField>
                <CheckboxField name="enable_routes" label={t("enable_routes")} checked={enableRoutes} onChange={onEnableRoutesChange} />
                <Button
                    className="btn btn-primary btn-square self-center ms-3 me-6"
                    onClick={onRequestClick}
                    title={networkMap ? t("reload") : t("load")}
                    disabled={networkMapIsLoading}
                >
                    {networkMap ? <FontAwesomeIcon icon={faSync} /> : <FontAwesomeIcon icon={faDownLong} />}
                </Button>
                {networkMap?.type === "raw" && (
                    <SelectField name="display_type" label={t("display_type")} value={displayType} onChange={onDisplayTypeChange}>
                        <option value="data">data</option>
                        <option value="map">map</option>
                    </SelectField>
                )}
            </div>

            {content}
        </>
    );
}
