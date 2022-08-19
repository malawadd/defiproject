import s from "../styles/Footer.module.scss"
import { FaHeart, FaCoffee } from "react-icons/fa"

export const Footer = () => {
    return (
        <footer className={s.footer}>
            <p className={s.footerText}>
            Built for  {"  "}
            <a
            target="_blank"
            rel="noreferrer"
            className={s.footerLink}
            href="https://buidlit.polygon.technology/"
            >
               Polygon BUIDL IT : Summer 2022 {"  "}
            </a>
            </p>
        </footer>
    )
}