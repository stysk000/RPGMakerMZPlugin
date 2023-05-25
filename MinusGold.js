/*=============================================================================
 * MinusGold.js
 *
 * MIT License Copyright (c) 2023 Stysk
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 * 
*=============================================================================
*/

/*:ja
 * @plugindesc 所持金のマイナスが可能になり、購入時に所持金での制限無し。
 * 
 * @target MZ
 * @url https://github.com/stysk000/RPGMakerMZPlugin
 * @author Stysk
 *
 * @help MinusGold.js
 * 
 * ■仕様
 * 所持金-9999999999までのマイナスが可能。
 * ショップでの購入時、所持金制限なし。
 * 
 * ■使い方
 * 設定はありません。
 * 
 * ■利用規約
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。不利益等生じても対応できませんので、
 *  自己責任でよろしくお願いします。
 * 
 */
(() => {
    'use strict';
 
    Game_Party.prototype.gainGold = function(amount) {
        this._gold = (this._gold + amount).clamp(-9999999999, this.maxGold());
        //this._gold = (this._gold + amount).clamp(0, this.maxGold());
    };

    Scene_Shop.prototype.money = function() {
        return 9999999999;
        // return this._goldWindow.value();
    };
    
})();