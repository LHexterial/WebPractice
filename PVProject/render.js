import { layouts } from "./layouts.js";
import { AnimSpan, startAnimationsSequentially, createAnimSpansFromString } from "./AnimSpan.js";


export function renderSections(container) {

    const parent = typeof container === 'string' ? document.querySelector(container) : container;


    if (!parent) throw new Error('容器不存在或者出现错误');

    const sectionControls = new Map();

    layouts.forEach(sectionData => {
        const sectionDiv = document.createElement('div');
        sectionDiv.classList.add('container', sectionData.id);

        const sectionQueue = [];// 这里记录着每一个单独的section的动画列表

        sectionData.items.forEach(item => {

            const el = document.createElement('div');
            el.classList.add(`${item.type}`);
            const rowStart = item.row.start;
            const rowEnd = item.row.end;
            const colStart = item.col.start
            const colEnd = item.col.end;
            el.style.gridRow = `${rowStart} / ${rowEnd}`;
            el.style.gridColumn = `${colStart} / ${colEnd}`;

            if (item.animSpanSettings) {
                const { fragment, animSpans } = createAnimSpansFromString(item.animSpanSettings.text, {
                    autoStart: item.animSpanSettings.autoStart,
                    TextLib: item.animSpanSettings.TextLib,
                    rangeLen: item.animSpanSettings.rangeLen,
                    classname: item.animSpanSettings.classname
                });
                el.appendChild(fragment);
                
                sectionQueue.push({
                    element: el,
                    animSpans: animSpans
                })
                
                
            }

            sectionDiv.appendChild(el);
        });
        parent.appendChild(sectionDiv);

        if (sectionQueue.length > 0)
        {
            let currentIndex = 0;
            let isPlaying = false;
            let timerId = null;

            function resetAll() {
                sectionQueue.forEach(({ animSpans }) => {
                    animSpans.forEach(span => span.Reset());
                })
            }

            function stopCurrent() {
                if (timerId) {
                    clearTimeout(timerId);
                    timerId = null;
                }
                sectionQueue.forEach(({ animSpans }) => {
                    animSpans.forEach(span => span.Stop());
                });
                isPlaying = false;
            };

            function playNext() {
                if (currentIndex >= sectionQueue.length) {
                    isPlaying = false;
                    return;
                }

                const { element, animSpans } = sectionQueue[currentIndex];

                const controller = startAnimationsSequentially(animSpans, 0, 30);
                element._animController = controller;
                isPlaying = true;

                controller.onComplete(() => {
                    currentIndex++;
                    playNext();
                })

            }

            function start() {
                if (isPlaying) return;
                resetAll();
                currentIndex = 0;
                playNext();
            }

            function stop()
            {
                stopCurrent();
            }

            function replay()
            {
                stop();
                start();
            }

            sectionControls.set(sectionData.id, {
                start,
                stop,
                replay,
                resetAll,
                isPlaying: () => isPlaying,
                getQueue: () => sectionQueue,
                sectionDiv,
            })
            start();
        }


    });

    return {
        getControllerByElement: (el) => el._animController || null,

        replaySection: (sectionId) => {
            const control = sectionControls.get(sectionId);
            if (control) {
                control.replay();
            } else {
                console.warn(`Section ${sectionId} not found`);
            }
        },

        stopSection: (sectionId) => {
            const control = sectionControls.get(sectionId);
            if (control) control.stop();
        },

        startSection: (sectionId) => {
            const control = sectionControls.get(sectionId);
            if (control) control.start();
        },
        getAllSeticonControls: () => {
            const result = {};
            sectionControls.forEach((ctrl, id) => {
                result[id] = ctrl;
            });
            return result;
        }

    }

}