import s from "../styles/Header.module.scss"
import Image from "next/image"

export const Header = ({ walletConnected, account, connectWallet }) => {
  if (!walletConnected)
    return (
      <div className={s.container}>
        {/* <Image className={s.logo} src={Logo} height={90} width={81} /> */}

        <button
          handleClick={connectWallet}
          className={s.button}
          buttonText="Connect Wallet"
        ></button>

      </div>
        
    )
  
}