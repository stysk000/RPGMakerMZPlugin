/*=============================================================================
 * SpecifySubstitute.js
 *
 * MIT License Copyright (c) 2023 Stysk
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 * 
 * このプラグインは以下のMITライセンスプラグインの改変を含み再配布しております。
 * * 身代わり表示 KRD_MZ_UI_Substitute.js   (c) 2021 kuroudo119 (くろうど)
 * 
*=============================================================================
*/

/*:ja
 * @plugindesc かばう（身代わり）を対象指定にします（TPB時は対象の前に立つ）。
 * 
 * @target MZ
 * @url https://github.com/stysk000/RPGMakerMZPlugin
 * @author Stysk
 *
 * @help SpecifySubstitute.js
 * 身代わりの仕様を変更。自動は廃止し、指定した仲間とします。
 * 
 * ■仕様
 * ・仲間のみを指定することを想定しています。
 * ・エネミーからのダメージやスキルに対応。
 * ・今のところエネミー側はこのスキルを利用できません。
 * ・自動時にあったひん死条件などはなくなっています。とにかくかばいます。
 * 
 * ※TPBバトル（ウェイト）でのみ動作確認しています。
 * 
 * ■使い方
 * デフォルトの「かばう」のスキルを、味方単体指定に変更するだけです。
 * （正確には、スキルにステート付加「かばう」がついており、
 *  ステートかばうには、特殊フラグ身代わりがついていること）
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
 

    Game_BattlerBase.prototype._Stysk_subsutituteFriends = {};
    Game_BattlerBase.prototype._Stysk_subsutituteTargetId = null;

    // 元の状態クリア処理に、身代わり関連処理追加
    const _clearStates = Game_BattlerBase.prototype.clearStates;
    Game_BattlerBase.prototype.clearStates = function() {
        _clearStates.call(this);
        this._Stysk_subsutituteFriends = {};
        this._Stysk_subsutituteTargetId = null;
    };    

    // ステート付与処理前に、身代わり特殊処理を追加
    //  かばうを対象指定のスキルとして使う前提である
    //  このままだと指定した対象に身代わりステートを付与することになるので、反転させ、自分に付与とする
    //  お互いのインスタンスに、お互いのIDを記憶（誰が誰をかばうのか）
    const _itemEffectAddState = Game_Action.prototype.itemEffectAddState;
    Game_Action.prototype.itemEffectAddState = function(target, effect) {
        // ステートが身代わり時のみ処理
        if(effect.code == 21 && effect.dataId == 19){
            const subId = this.subject().actorId();
            const targetId = target.actorId();
            
            if(subId != targetId){
                this.makeSuccess(target);

                target._Stysk_subsutituteFriends[subId] = this.subject();
                this.subject()._Stysk_subsutituteTargetId = targetId;
    
                target = this.subject();
            }
        }
        _itemEffectAddState.call(this, target, effect);
    };

    // 被ダメージ時、指定した相手のみを身代わり判定
    BattleManager.applySubstitute = function(target) {
        // 攻撃側はエネミーであること
        if (!this._action.subject().isActor()) {
            // 仲間の中に自分を守るステート持ってる人がいるかどうか
            const friends = target._Stysk_subsutituteFriends;
            for(let key in friends){
                const fr = friends[key];
                if(fr.isSubstitute() && fr._Stysk_subsutituteTargetId == target.actorId() ){
                    this._logWindow.displaySubstitute(fr, target);
                    target = fr;
                    break;
                }else{
                    delete target._Stysk_subsutituteFriends[key];
                }
            }
        }
        return target;
    };


    /*
     * 身代わり時に、対象の前に立ってくれるプラグイン
     * (改変) 身代わり表示 KRD_MZ_UI_Substitute.js   (c) 2021 kuroudo119 (くろうど)
     */
    const KRD_BattleManager_applySubstitute = BattleManager.applySubstitute;
    BattleManager.applySubstitute = function(target) {
        const realTarget = KRD_BattleManager_applySubstitute.call(this, target);
    
        if (BattleManager.isTpb() && realTarget !== target) {
            target.substituted(realTarget);
            target.requestMotionRefresh();
        }
        return realTarget;
    };
    
    Game_Battler.prototype.clearSubstitute = function() {
        this._substitute = null;
    };
    
    Game_Battler.prototype.isSubstituting = function() {
        return !!this._substitute;
    };
    
    Game_Battler.prototype.substituted = function(substitute) {
        this._substitute = substitute;
    };
    
    Game_Battler.prototype.substitute = function() {
        return this._substitute;
    };
    
    const KRD_Sprite_Actor_refreshMotion = Sprite_Actor.prototype.refreshMotion;
    Sprite_Actor.prototype.refreshMotion = function() {
        const actor = this._actor;
        if (actor) {
            if (actor.isSubstituting()) {
                this.startMotion("guard");
                this.substituteMove(actor.substitute());
                actor.clearSubstitute();
            }
        }
        KRD_Sprite_Actor_refreshMotion.call(this);
    };
    
    Sprite_Actor.prototype.substituteMove = function(substitute) {
        if (substitute) {
            const substituteSprite = this.parent.children.find(child => child._battler === substitute);
    
            if (substituteSprite) {
                const subX = substituteSprite.x;
                const subY = substituteSprite.y;
                const subW = substituteSprite.width;
                const x = this.x - subX - subW;
                const y = this.y - subY;
                const duration = 12;
                substituteSprite.startMove(x, y, duration);
            }
        }
    };
    ////////////////////////////////////////////////////////////////////////////////

})();