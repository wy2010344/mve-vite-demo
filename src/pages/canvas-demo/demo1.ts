import { hookClip, hookDraw, hookStroke } from 'mve-dom-helper/canvasRender'
import { drawText, drawTextWrap, measureTextWrap } from 'wy-dom-helper/canvas'
export default function () {
  hookDraw({
    x: 150,
    y: 500,
    withPath: true,
    draw({ ctx, path }) {
      path.rect(0, 0, 300, 300)
      hookStroke(10, 'green')
      hookStroke(10, 'blue')
      hookClip()
      hookStroke(10, 'yellow')
      const o = measureTextWrap(
        ctx,
        'كانت زوجتي صامتة بشكل غريب طوال الرحلة، وبدا عليها القلق من الشر. تحدثت إليها مطمئنًا، مشيرًا إلى أن المريخيين مقيدين بالحفرة بسبب ثقلها الشديد، وفي أقصى الأحوال لا يمكنهم سوى الزحف قليلاً للخروج منها؛ لكنها أجابت بكلمات أحادية المقطع. ولولا وعدي لصاحب النزل، لكانت قد حثتني، على ما أعتقد، على البقاء في ليذرهيد تلك الليلة. أتمنى لو فعلت ذلك! أتذكر أن وجهها كان شاحبًا للغاية بينما كنا نجلس. من ناحيتي، كنت متحمسًا للغاية طوال اليوم...',
        300,
        {
          lineHeight: 30,
          maxLines: 4,
          fontSize: '20px',
          fontFamily: 'serif',
        }
      )
      drawTextWrap(ctx, o)
    },
  })
  hookDraw({
    x: 500,
    y: 500,
    withPath: true,
    onPointerDown(e) {
      console.log('inPath', e.inPath, 'inStroke', e.inStroke)
    },
    draw({ ctx, path }) {
      path.rect(0, 0, 300, 300)
      // path.ellipse(0, 0, 500, 500, 0, 0, 0)
      hookStroke(10, 'red')
      drawText(
        ctx,
        {
          text: '...中文!',
          direction: 'rtl',
          textAlign: 'left',
          fontFamily: 'serif',
          fontSize: '30px',
          lineDiffStart: 0,
        },
        {
          style: 'green',
          x: 90,
          y: 90,
        }
      )
      const o = measureTextWrap(
        ctx,
        'My wife was curiously silent throughout the drive, and seemed oppressed with forebodings of evil.  I talked to her reassuringly, pointing out that the Martians were tied to the Pit by sheer heaviness, and at the utmost could but crawl a little out of it; but she answered only in monosyllables.  Had it not been for my promise to the innkeeper, she would, I think, have urged me to stay in Leatherhead that night.  Would that I had!  Her face, I remember, was very white as we parted. For my own part, I had been feverishly excited all day.',
        300,
        {
          lineHeight: 30,
          maxLines: 4,
        }
      )

      drawTextWrap(ctx, o)
      // return {
      //   operates: [
      //     {
      //       type: "stroke",
      //       width: 10,
      //       style: "red"
      //     },
      //     {
      //       type: "draw", callback(ctx) {
      //       },
      //     }
      //     // {
      //     //   type: "fill",
      //     //   style: "green"
      //     // },
      //     // { type: "clip" },
      //     // {
      //     //   type: "stroke",
      //     //   width: 10,
      //     //   style: "blue"
      //     // },
      //     // {
      //     //   type: "fill",
      //     //   style: "orange"
      //     // },
      //     // { type: "clip" },
      //     // {
      //     //   type: "stroke",
      //     //   width: 10,
      //     //   style: "yellow"
      //     // },
      //   ]
      // }
    },
  })
}
