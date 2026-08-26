class AnimSpan {
    constructor(TextLib, SIndex, EIndex, SelfChar, options = {})
    {
        this._textlib = TextLib;
        this._sindex = SIndex;
        this._eindex = EIndex;
        this._selfchar = SelfChar;
        this._options = options;

        this.timer = null;
        this.spanRef = document.createElement('span');
        this.isRunning = false;
        this.currentIndex = SIndex;
    }

    Stop() // 用来直接停止控件的动画播放
    {
        if (this.timer)
        {
            clearTimeout(this.timer);
            this.timer = null;
        }
        if (this._delaytimer)
        {
            clearTimeout(this._delaytimer);
            this._delaytimer = null;
        }
        this.isRunning = false;
    }

    StartAnim(speed = 100, delay = 0) // speed默认是毫秒
    {
        if (this.isRunning)
        {
            this.Stop();
        }
        if (this._sindex > this._eindex)
        {
            this.spanRef.textContent = this._selfchar;
            if (this._options.onComplete) this._options.onComplete()
            return;
        }
        this._delaytimer = setTimeout(() => {
            this.isRunning = true;
            this.spanRef.textContent = '';
            this.currentIndex = this._sindex;
            const tick = () => {
                if (!this.isRunning) return;
                if (this.currentIndex <= this._eindex) {
                    this.spanRef.textContent = this._textlib[this.currentIndex];
                    this.currentIndex++;
                    this.timer = setTimeout(tick, speed);
                }
                else if (this.currentIndex == this._eindex + 1) {
                    this.spanRef.textContent = this._selfchar;
                    this.currentIndex++;
                    this.timer = setTimeout(tick, speed);
                }
                else {
                    this.Stop();
                    if (this._options.onComplete) {
                        this._options.onComplete();
                    }
                }
            }
            this.timer = setTimeout(tick, speed);
        }, delay);
    }

    Reset()
    {
        this.Stop();
        this.spanRef.textContent = '';
        this.currentIndex = this._sindex;
    }

    setClassName(classname)
    {
        this.spanRef.classList.add(classname);
    }

    getSpanRef()
    {
        return this.spanRef;
    }

    setFinalChar(char)
    {
        this._selfchar = char;
    }
}



function createAnimSpansFromString(str, options = {}) // options用于传递相应的参数
// 返回的是一个fragment 和 相应的animSpan的数组
{
    const {
        autoStart = false,
        speed = 100,
        classname = '',
        onCompleteEach = null,
        TextLib = str,
        rangeLen = null,
    } = options;
    const fragment = document.createDocumentFragment();
    const libLen = TextLib.length;
    const animSpans = str.split('').map((c) => {
        let StartIndex, EndIndex;
        let len;

        if (rangeLen !== null) {
            len = Math.min(rangeLen, libLen);
        }
        else {
            len = Math.min(2 + Math.floor(Math.random() * 4), libLen);
        }

        if (libLen === 0) {
            StartIndex = 0;
            EndIndex = -1;
        }
        else {
            const maxStart = libLen - len;
            if (maxStart < 0) {
                StartIndex = 0;
                EndIndex = libLen - 1;
            }
            else {
                StartIndex = Math.floor(Math.random() * (maxStart + 1));
                EndIndex = StartIndex + len - 1;
            }
        }

        const anim = new AnimSpan(TextLib, StartIndex, EndIndex, c, {
            onComplete: onCompleteEach || undefined,
        });

        if (classname) {
            anim.setClassName(classname);
        }
        fragment.appendChild(anim.spanRef);
        return anim;
    });
    if (autoStart)
    {
        animSpans.forEach(anim => {
            anim.StartAnim(speed);
        })
    }
    else
    {
        animSpans.forEach(anim => {
            anim.spanRef.textContent = anim._selfchar;
        })
    }
    return { fragment, animSpans };
}


function startAnimationsSequentially(animSpans, interval = 300, animSpeed = 100)
{
    let currentIndex = 0;
    let isStopped = false;
    let timer = null;
    let onAllComplete = null; // 全局回调函数
    const total = animSpans.length;

    function startNext() {
        if (isStopped || currentIndex >= total)
        {
            if (!isStopped && typeof onAllComplete === 'function')
            {
                onAllComplete();
            }
            return;
        }
        const span = animSpans[currentIndex];
        span.spanRef.style.opacity = '1';

        const orginalComplete = span._options.onComplete;// 这里解决的是创建span的时候带来的原本的回调函数

        span._options.onComplete = () => {
            if (orginalComplete) orginalComplete();
            currentIndex++;

            if (currentIndex < total && !isStopped) {
                timer = setTimeout(startNext, interval);
            }
            else {
                if (!isStopped && typeof onAllComplete === 'function') {
                    onAllComplete();
                }
            }
        };
        span.StartAnim(animSpeed);
    }

    timer = setTimeout(startNext, interval);

    return {
        stop() {
            isStopped = true;
            if (timer)
            {
                clearTimeout(timer);
                timer = null;
            }
            animSpans.forEach(animSpan => {
                animSpan.Stop();
            })
        },

        restart()
        {
            this.stop();
            isStopped = false;
            currentIndex = 0;
            animSpans.forEach(span => span.Reset());
            timer = setTimeout(startNext, interval);
        },

        onComplete(callback)
        {
            onAllComplete = callback;
            return this;
        }
    }

}


const root_container = document.querySelector('.root-container');

const { fragment, animSpans } = createAnimSpansFromString('时光终有一天会将我们分开，但是，即使如此，在那日降临之前，让我们一直在一起吧。', {
    autoStart: false,
    TextLib: '繁星的海洋里，飞机缓缓地滑翔，你像猫咪一样，悄然无息的靠近，从我无法顾及的角度，拨弄我心弦，惊讶之情，无以言表。你让我总是跟不上你的步伐，钢铁般的躯体，仿佛流星一样，只是与你仰望同一片天空，眼里见惯的风景便变的不一样了。你的一举一动牵动我的一喜一忧，在心中化为点点音符，这份感觉该怎么称呼才好，这种心情该如何表达才行，这也许就是所谓的恋爱吧',
    rangeLen: 4,
    classname: 'test',
});

root_container.appendChild(fragment);

const controller = startAnimationsSequentially(animSpans, 0, 50);

controller.onComplete(() => {
    console.log('所有动画播放完成');
})



