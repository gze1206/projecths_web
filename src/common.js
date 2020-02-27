export class Button {
    text = '';
    cb = () => {};
    color = '';
    cols = '';

    /**
     * 
     * @param {{text: string, cb: () => void, color: string, cols: number}} param 
     */
    constructor(param) {
        this.text = param.text;
        this.cb = param.cb;
        this.color = param.color;
        this.cols = (param.cols || '').toString();
    }
}

export function GetRank(val) {
    switch (val) {
        case 0: return '일반';
        case 1: return '희귀';
        case 2: return '영웅';
        case 3: return '전설';
        default: return '???';
    }
}

export function GetRace(val) {
    switch (val) {
        case 1: return '멀록';
        case 2: return '악마';
        case 3: return '기계';
        case 4: return '정령';
        case 5: return '야수';
        case 6: return '용족';
        case 7: return '모두';
        default: return '없음';
    }
}

export function GetTag(val) {
    switch (val) {
        case 'FROZEN': return '빙결';
        case 'TAUNT': return '도발';
        case 'POISONOUS': return '독성';
        case 'WINDFURY': return '질풍';
        case 'DIVINESHIELD': return '천상의 보호막';
        default: return '';
    }
}

export function GetDamageType(val) {
    switch (val) {
        case 'NORMAL': return '일반 공격';
        case 'COUNTER': return '반격';
        case 'EFFECT': return '카드 효과';
        default: return '알 수 없는 공격';
    }
}

export function ScrollToEnd() {
    $([document.documentElement, document.body]).animate({
        scrollTop: $(".choices").offset().top
    }, 500);
}

export function MakeBuyButtons(cards, cb) {
    return cards.map((card, idx) => {
        const eff = JSON.parse(card.effect);
        const stat = eff.STAT;
        let tags = stat.Tags.map(tag => GetTag(tag)).filter(tag => tag?.length > 0).join(', ');
        if (tags.length > 0) {
            tags = `\n${tags}`;
        }

        const text = `[고용]\n${card.tier}단계 ${GetRank(card.rank)} : ${card.name}\n종족 : ${GetRace(card.race)}\nATK : ${stat.Attack}, HP : ${stat.HP}${tags}\n\n${card.description}`;
        return new Button({
            text: text.replace(/\n/gi, '</br>'),
            cb: () => cb(idx),
            color: 'green',
            cols: 2
        });
    });
}

export function MakeModifyButtons(cards, cb) {
    console.log(cards instanceof Array);
    return cards.map((card, idx) => {
        const eff = JSON.parse(card.effect);
        const stat = eff.STAT;
        let tags = stat.Tags.map(tag => GetTag(tag)).filter(tag => tag?.length > 0).join(', ');
        if (tags.length > 0) {
            tags = `\n${tags}`;
        }

        const gold = card.is_gold ? '황금 ' : '';

        const text = `${card.tier}단계 ${GetRank(card.rank)} : ${gold}${card.name}\n종족 : ${GetRace(card.race)}\nATK : ${stat.Attack}, HP : ${stat.HP}${tags}\n\n${card.description}`;
        return new Button({
            text: `[해고/재배치]\n${text}`.replace(/\n/gi, '</br>'),
            cb: () => cb(idx, { name: card.name, info: text }),
            color: 'red',
            cols: 2
        });
    });
}

export function MakeSummonButtons(cards, cb) {
    return cards.map((card, idx) => {
        const eff = JSON.parse(card.effect);
        const stat = eff.STAT;
        let tags = stat.Tags.map(tag => GetTag(tag)).filter(tag => tag?.length > 0).join(', ');
        if (tags.length > 0) {
            tags = `\n${tags}`;
        }
        
        const gold = card.is_gold ? '황금 ' : '';

        const text = `[소환]\n${card.tier}단계 ${GetRank(card.rank)} : ${gold}${card.name}\n종족 : ${GetRace(card.race)}\nATK : ${stat.Attack}, HP : ${stat.HP}${tags}\n\n${card.description}`;
        return new Button({
            text: text.replace(/\n/gi, '</br>'),
            cb: () => cb(idx),
            color: 'teal',
            cols: 2
        });
    });
}

export function MakeBlockButtons(cards) {
    return cards.map(card => {
        const eff = JSON.parse(card.effect);
        const stat = eff.STAT;
        let tags = stat.Tags.map(tag => GetTag(tag)).filter(tag => tag?.length > 0).join(', ');
        if (tags.length > 0) {
            tags = `\n${tags}`;
        }
        
        const gold = card.is_gold ? '황금 ' : '';

        const text = `${card.tier}단계 ${GetRank(card.rank)} : ${gold}${card.name}\n종족 : ${GetRace(card.race)}\nATK : ${stat.Attack}, HP : ${stat.HP}${tags}\n\n${card.description}`;
        return new Button({
            text: text.replace(/\n/gi, '</br>'),
            cb: () => {},
            color: 'black',
            cols: 2
        });
    });
}

export function MakePlaceButton(cb, idx) {
    return new Button({
        text: '이 곳에 배치',
        cb: () => cb(idx),
        color: 'teal',
        cols: 2
    });
}

export function MakeHeroPowerButton(card, cb) {
    const text = `${card.name}\n비용 : ${card.cost}\n\n${card.description}`;
    return new Button({
        text: text.replace(/\n/gi, '<br/>'),
        cb: cb,
        color: 'orange',
        cols: 2
    });
}

export const MODE_UNKNOWN = '';
export const MODE_SHOP = 'SHOP';
export const MODE_REPLACE = 'REPLACE';
export const MODE_MODIFY = 'MODIFY';
export const MODE_BATTLE = 'BATTLE';