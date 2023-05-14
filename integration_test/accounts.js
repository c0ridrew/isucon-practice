//SharedArrayをimport
import { SharedArray } from 'k6/data';

//accounts.jsonを読み込んでSharedArrayにする
const accounts = new SharedArray('accounts', function () {
  return JSON.parse(open('./accounts.json'));
});
//SharedArrayからランダムに1件取り出して返却する関数
export function getAccount() {
  return accounts[Math.floor(Math.random() * accounts.length)];
};
