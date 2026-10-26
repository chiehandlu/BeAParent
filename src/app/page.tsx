import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-4xl font-bold">當爸媽這件事</h1>
      <p className="text-lg text-neutral-700">
        從得知懷孕的那天起，到孩子長大成家，再到你向這個世界告別。
        <br />
        航行十座島嶼，做出每一個選擇，看看你是怎樣的父母。
      </p>
      <Link href="/play" className="btn-primary">
        開始旅程
      </Link>
    </main>
  );
}
