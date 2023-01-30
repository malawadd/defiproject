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
            href="https://web3-talents.io/defi-talents"
            href=" "
            >
               DEFI TALENT COHORT 3 {"  "}
                {"  "}
            </a>
            </p>
        </footer>
    )
}
