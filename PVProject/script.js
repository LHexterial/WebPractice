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

const phrases = [
    '你好世界',
    'Hello World',
    '深度学习',
    'RNN',
    '注意力机制',
    '自然语言处理',
    'PyTorch',
    'JavaScript',
    'CSS Grid',
    '随机生成',
    '向上移动',
    '不重叠'
];


const mains = document.querySelectorAll('.main');



function randomNum(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomSelect(arr)
{
    return arr[Math.floor(Math.random() * arr.length)];
}

function createTest() {
    const main = randomSelect(mains);
    const text = randomSelect(phrases);
    const block = document.createElement('div');
    block.classList.add('block');
    const { fragment, animSpans } = createAnimSpansFromString(text, {
        autoStart: false,
        classname: 'test',
        rangeLen: 6,
        TextLib: '花开，然后花谢；星星是璀璨的，但那光芒也有消失的时候；这个地球、太阳、银河系，还有这个浩瀚的宇宙都会有死的一天。人类的一生，与这些相比的话——不过是一眨眼那么短暂而已。在那样短暂的时光中，人们诞生、欢笑、流泪、战斗、受伤、欢喜、悲伤……憎恨某人，爱上某人，一切的一切，都只是刹那的邂逅。终究将归入死的永眠。这世界上，有些人有多冷漠，有些人就有多温暖。你看，这就是人性的卑微。极力的掩饰自己的肮脏，却又在被戳破后恼羞成怒。就算不快乐也不要皱眉，因为你永远不知道，谁会爱上你的笑容'
    })

    block.appendChild(fragment);
    main.appendChild(block);
    const contorller = startAnimationsSequentially(animSpans, 80, 60);

    contorller.onComplete(() => {
        block.classList.add('move-up');
        block.addEventListener('transitionend', () => {
            block.remove();
        }, { once: true})
    })
}


function scheduleNext() {
    const delay = randomNum(2000, 6000);
    setTimeout(() => {
        createTest();
        scheduleNext();
    }, delay);
}

scheduleNext();