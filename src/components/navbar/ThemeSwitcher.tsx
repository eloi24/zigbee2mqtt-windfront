import { faPaintBrush } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo, useEffect, useState } from "react";
import { useLocation } from "react-router";
import store2 from "store2";
import { THEME_KEY } from "../../localStoreConsts.js";
import PopoverDropdown from "../PopoverDropdown.js";

const ALL_THEMES = [
    "", // "Default"
    "Light",
    "Dark",
    "Abyss",
    "Acid",
    "Aqua",
    "Autumn",
    "Black",
    "Bumblebee",
    "Business",
    "Caramellatte",
    "Cmyk",
    "Coffee",
    "Corporate",
    "Cupcake",
    "Cyberpunk",
    "Dim",
    "Dracula",
    "Emerald",
    "Fantasy",
    "Forest",
    "Garden",
    "Halloween",
    "Lemonade",
    "Lofi",
    "Luxury",
    "Night",
    "Nord",
    "Pastel",
    "Retro",
    "Silk",
    "Sunset",
    "Synthwave",
    "Valentine",
    "Winter",
    "Wireframe",
];

const ThemeSwitcher = memo(() => {
    const location = useLocation();
    const [currentTheme, setCurrentTheme] = useState<string>(store2.get(THEME_KEY, ""));

    useEffect(() => {
        store2.set(THEME_KEY, currentTheme);
        document.documentElement.setAttribute("data-theme", currentTheme);
    }, [currentTheme]);

    return (
        <PopoverDropdown
            name="theme-switcher"
            buttonChildren={<FontAwesomeIcon icon={faPaintBrush} />}
            dropdownStyle="dropdown-end"
            // do not allow theme-switching while on network page due to rendering of reagraph
            buttonDisabled={location.pathname === "/network"}
        >
            {ALL_THEMES.map((theme) => (
                <li key={theme || "default"}>
                    <input
                        type="radio"
                        name="theme-dropdown"
                        className={`theme-controller w-full btn btn-sm btn-block ${currentTheme === theme.toLowerCase() ? "btn-primary" : "btn-ghost"}`}
                        aria-label={theme || "Default"}
                        value={theme.toLowerCase()}
                        onChange={() => setCurrentTheme(theme.toLowerCase())}
                    />
                </li>
            ))}
        </PopoverDropdown>
    );
});

export default ThemeSwitcher;
