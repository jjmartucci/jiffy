import styles from "./GlowBox.module.css";

type Props = {
  children: React.ReactNode;
};
const GlowBox = ({ children }: Props) => {
  return (
    <div className={styles.GlowBox}>
      <div className={styles.Glowbox_Inner}>{children}</div>
    </div>
  );
};

export default GlowBox;
