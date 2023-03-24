import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useEffect, useState } from "react";
import styles from "./index.module.css";

type Image = {
  id: string;
  url: string;
  width: number;
  height: number;
};

// getServerSidePropsから渡されるpropsの型
type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const IndexPage: NextPage<Props> = ({ initialImageUrl }) => {
  // useStateを使って状態を定義する
  console.log(initialImageUrl);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [loading, setLoading] = useState(false);

  // マウント時に画像を読み込む宣言
  // useEffect(() => {
  //   // useEffectに非同期関数を直接渡すことができないため、thenメソッドを使用する
  //   fetchImage().then((newImage) => {
  //     setImageUrl(newImage.url); // 画像URLの状態を更新する
  //     setLoading(false); // ローディング状態を更新する
  //   });
  // }, []);

  // ボタンがクリックしたときに画像を読み込む処理
  const handleClick = async (): Promise<void> => {
    setLoading(true); // 読み込み中フラグを立てる
    const newImage = await fetchImage();
    setImageUrl(newImage.url); // 画像URLの状態を更新する
    setLoading(false);
  };

  // ローディング中でなければ、画像を表示する
  return (
    <div className={styles.page}>
      <button onClick={handleClick} className={styles.button}>
        他のにゃんこも見る
      </button>
      <div className={styles.frame}>
        {loading || <img src={imageUrl} className={styles.img} />}
      </div>
    </div>
  );
};

// The Cat APIを使用して猫画像をランダムに取得する
const fetchImage = async (): Promise<Image> => {
  const res = await fetch("https://api.thecatapi.com/v1/images/search");
  const images = await res.json();

  // 配列として表現されているか
  if (!Array.isArray(images)) {
    throw new Error("猫の画像が取得できませんでした");
  }

  const image: unknown = images[0];

  // Imageの構造になっているか
  if (!isImage(image)) {
    throw new Error("猫の画像が取得できませんでした");
  }

  return image;
};

// 型ガード関数
const isImage = (value: unknown): value is Image => {
  // 値がオブジェクトなのか
  if (!value || typeof value != "object") {
    return false;
  }

  // urlプロパティが存在し、かつ、それが文字列かどうか
  return "url" in value && typeof value.url === "string";
};

// サーバーサイドで実行する処理
export const getServerSideProps: GetServerSideProps = async () => {
  const image = await fetchImage();
  return {
    props: {
      initialImageUrl: image.url,
    },
  };
};

export default IndexPage;
