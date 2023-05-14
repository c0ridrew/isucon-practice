import http from 'k6/http';
import { check } from 'k6';
import { parseHTML } from "k6/html";
import { url } from "./config.js";
import { getAccount } from './accounts.js';

//ベンチマーカーがが実行するシナリオ関数//ログインしてからコメントを投稿する
export default function () {
  const account = getAccount();
  ///loginに対してアカウント名とパスワードを送信
  const login_res = http.post(url("/login"),
    { account_name: account.account_name, password: account.password }
  );

  //レスポンスのステータスコードが200であることを確認
  check(login_res, { "isstatus200": (r) => r.status === 200, });

  //ユーザーページ/@terraをGET
  const res = http.get(url("/@terra"));
  //レスポンスの内容をHTMLとして解釈
  const doc = parseHTML(res.body);

  //フォームのhidden要素からcsrf_token,post_idを抽出
  const token = doc.find('input[name="csrf_token"]').first().attr("value");
  const post_id = doc.find('input[name="post_id"]').first().attr("value");

  ///commentに対して、post_id,csrf_tokenとともにコメント本文をPOST
  const comment_res = http.post(url("/comment"), {
    post_id: post_id,
    csrf_token: token,
    comment: "Hellok6!",
  });
  check(comment_res, {
    "isstatus200": (r) => r.status === 200,
  });
}
