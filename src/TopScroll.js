import React, { useState, useEffect } from "react";
import { BiArrowToTop } from "react-icons/bi";
import "./index.css";

const TopScroll = () => {
    const [showTopButton, setShowTopButton] = useState(false);
    useEffect(() => {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 800) {
                setShowTopButton(true);
            } else {
                setShowTopButton(false);
            }
        });
    }, []);
    const goToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };
    return (
        <div className="top-to-btm">
            {" "}
            {showTopButton && (
                <BiArrowToTop
                    className="icon-position icon-style"
                    onClick={goToTop}
                />
            )}{" "}
        </div>
    );
};
export default TopScroll;