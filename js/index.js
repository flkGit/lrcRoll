// console.log(lrc)
/**
 * 处理歌词
 * 将歌词变为数组对象
 * @returns {*[{
 *     time: '',
 *     words: ''
 * }]}
 */
function parseLrc() {
    var lines = lrc.split('\n')
    var lrcArr = []
    for(var i=0;i<lines.length;i++){
        var str = lines[i]
        var parts = str.split(']')
        var timeStr = parts[0].substring(1)
        var lrcObj = {
            time: parseTime(timeStr),
            words: parts[1]
        }
        lrcArr.push(lrcObj)
    }
    return lrcArr
}

/**
 * 将时间字符串解析为具体秒数并返回
 * @param timeStr {String}
 * @returns {number}
 */
function parseTime(timeStr){
    var parts = timeStr.split(':')
    return +parts[0] * 60 + +parts[1]
}

var lrcData = parseLrc()

var doms = {
    audio: document.querySelector('audio'),
    container: document.querySelector('.container'),
    ul: document.querySelector('.container ul')
}

/**
 * 计算出，在歌词播放到第几秒的情况下
 * lrcData数组中，应该高亮显示的数组下标
 * 如果没有任何一句歌词则返回-1
 */
function findIndex() {
    var currentTime = doms.audio.currentTime
    for(var i=0;i<lrcData.length;i++){
        if(lrcData[i].time > currentTime){
            return i-1
        }
    }
    // 播放到最后一句的情况
    return lrcData.length - 1
}

// 界面

/**
 * 创建歌词元素 li
 */
function createLrcElenents() {
    var frag = document.createDocumentFragment()
    for(var i=0;i<lrcData.length;i++){
        var li = document.createElement('li')
        li.textContent = lrcData[i].words
        frag.appendChild(li)
    }
    doms.ul.appendChild(frag)
}

createLrcElenents()

// 容器高度
var containerHeight = doms.container.clientHeight
// li高度
var liHeight = doms.ul.children[0].clientHeight
// ul最大偏移量
var maxOffset = doms.ul.clientHeight - containerHeight

/**
 * 设置ul元素偏移量
 */
function setUlOffset() {
    var index = findIndex()
    var li = document.querySelector('.container .active')
    if(li){
        li.classList.remove('active')
    }
    li = doms.ul.children[index]
    var offset = index * liHeight + liHeight/2 - containerHeight / 2
    if(offset<0){
        offset = 0
    }
    if(offset>maxOffset){
        offset = maxOffset
    }
    doms.ul.style.transform = `translateY(-${offset}px)`
    if(li){
        li.classList.add('active')
    }
}

// 监听音频播放器currentTime改变
doms.audio.addEventListener('timeupdate', setUlOffset)
