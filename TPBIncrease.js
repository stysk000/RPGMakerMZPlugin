//=============================================================================
// TPBIncrease.js
//
// MIT License Copyright (c) 2023 Stysk
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:ja 
 * @plugindesc TPBゲージのリセット時に値を増加させるステートを作成できます。
 * 待機コマンドの作成などに役に立ちます。
 * 
 * @target MZ
 * @url https://github.com/stysk000/RPGMakerMZPlugin
 * @author Stysk
 *
 * @help TPBIncrease.js
 * 
 * TPBバトル（ウェイト）でのみ動作確認。
 * 例えば待機コマンドを作る場合、仕様上、スキルではなくステートでないと
 * 難しかったので、1ターン解除のステートなどでお使いください。
 * 
 * ■使い方
 * ステートのメモ欄に以下のような表記で可能。数値は0-1.0の間です。
 * <TPBInc: 0.5>
 * 
 * 
 * ■利用規約
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。不利益等生じても対応できませんので、
 *  自己責任でよろしくお願いします。
 * 
 */
(() => {
    'use strict';
 
    const _clearTpbChargeTime = Game_Battler.prototype.clearTpbChargeTime;
    Game_Battler.prototype.clearTpbChargeTime = function() {
        _clearTpbChargeTime.call(this);

        for(let s of this.states()){
            this._tpbChargeTime += parseFloat(s.meta["TPBInc"] ?? 0);
        }
    };
})();