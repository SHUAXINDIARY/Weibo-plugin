// 保存定时器id
let timeId = null
// 模拟setInterval
const repeat = function (fn, time) {
    return setTimeout(() => {
        fn()
        timeId = repeat(fn, time)
    }, time)
}
const start = () => {
    timeId = repeat(() => {
        // 获取点击更多
        setTimeout(() => {
            let more = document.querySelectorAll('i[class="woo-font woo-font--angleDown morepop_action_bk3Fq"]');
            if (more && more[0]) {
                more[0].click()
            } else {
                queueMicrotask(() => {
                    alert("当前页删除完成")
                    clearTimeout(timeId)
                })
            }
        }, 0)
        // 插入到点击更多之后执行
        setTimeout(() => {
            // 获取删除
            let del = document.querySelectorAll(
                'div[class="woo-box-flex woo-box-alignCenter woo-pop-item-main"]'
            )[6]
            if (del) {
                // 点击删除
                // queueMicrotask(() => {
                del.click();
                // })
            }
        }, 0)
        // 插入到点击删除之后执行
        setTimeout(() => {
            // 获取确定
            let sure = document.querySelector(
                'button[class="woo-button-main woo-button-flat woo-button-primary woo-button-m woo-button-round woo-dialog-btn"]'
            )
            if (sure && sure.textContent.trim() === '确定') {
                // 点击确定
                sure.click()
            }
        }, 0)

    }, 1500)
}
/**
 *  生成dom
 * @param {string} domName 
 * @param {string||object} textNode 
 * @param {object} props 
 */
const genDom = (domName, textNode, props) => {
    const resultDom = document.createElement(domName)
    // 给dom添加属性
    if (props) {
        Object.keys(props).forEach(key => {
            resultDom.setAttribute(key, props[key])
        })
    }
    // 判断是文本还是一个dom结构
    if (typeof textNode === 'string') {
        const text = document.createTextNode(textNode)
        resultDom.appendChild(text)
    } else {
        const { dom, text } = textNode
        let DOM = genDom(dom, text)
        resultDom.appendChild(DOM)
    }
    return resultDom
}
// 获取要插入dom的位置
const con = document.querySelector("div[class='woo-box-flex woo-tab-nav']")
// 生成确认面板
const confirmDom = genDom('div', { dom: 'p', text: "确定删除?" }, {
    class: "del_confirm_panel"
})
const btnList = genDom('div', '', {
    class: "del_btn_ist"
})
// 确认按钮
const confirmBtn = genDom('div', "确定", {
    class: 'del_btn'
})
// 取消按钮
const confirmCancel = genDom('div', "取消", {
    class: 'del_btn'
})
// 关闭面板
const closeConfirmPanel = () => {
    confirmDom.style.display = 'none'
}
// 打开面板
const openConfirmPanel = () => {
    confirmDom.style.display = 'block'
}
btnList.appendChild(confirmBtn)
btnList.appendChild(confirmCancel)
confirmDom.appendChild(btnList)
document.body.appendChild(confirmDom)
if (con) {
    const props = {
        class: 'del_btn'
    }
    let del = genDom('div', '删除', props)
    let stop = genDom('div', '停止', props)
    con.appendChild(del)
    con.appendChild(stop)
    // 删除
    confirmBtn.addEventListener('click', () => {
        // 清空上次的
        if (timeId) clearTimeout(timeId)
        // 根据筛选按钮判断是否在个人微博页
        let filter = document.querySelector('button[class="woo-button-main woo-button-line white xs woo-button-round"]')
        if (filter) {
            start()
            closeConfirmPanel()
        } else {
            alert("请跳转到个人主页，在进行操作")
            closeConfirmPanel()
        }
    })
    // 关闭确认面板
    confirmCancel.addEventListener('click', () => {
        closeConfirmPanel()
    })
    // 打开确认面板
    del.addEventListener('click', () => {
        openConfirmPanel()
    })
    // 停止删除
    stop.addEventListener('click', () => {
        clearTimeout(timeId)
    })
}
// 监控按键
window.addEventListener('keydown', (e) => {
    const {
        keyCode
    } = e
    if (keyCode === 27) clearTimeout(timeId)
})
window.addEventListener('scroll', () => {
    closeConfirmPanel()
})