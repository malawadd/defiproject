import s from "../styles/Header.module.scss"
import { Button } from "./Button"
import Image from "next/image"

export const Header = ({ walletConnected, account, connectWallet }) => {
  if (!walletConnected)
    return (
      <div className={s.container}>
         <p className={s.text } > Taamin</p>

        <Button
          handleClick={connectWallet}
          className={s.button}
          buttonText="Connect Wallet"
        ></Button>

      </div>
    )
    return (
      <div className={s.container}>
        <p className={s.text } > Taamin</p>
        <div className={s.headingItem}>
          
          <p className={s.text}>
            {
              account.length !== 42 
              ? account
              : `${account.substring(0, 3)}...${account.substring(39, 46)}`}
          </p>
        </div>
      </div>
    )
  
}