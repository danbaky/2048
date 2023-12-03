export class Tile {
    constructor(gridElem) {
        this.tileElem = document.createElement("div");
        this.tileElem.classList.add("tile");
        this.setValue(Math.random() > 0.5 ? 2 : 4);
        gridElem.append(this.tileElem);
    }

    setXY(x, y) {
        this.x = x;
        this.y = y;
        this.tileElem.style.setProperty("--x", x)
        this.tileElem.style.setProperty("--y", y)
    }

    setValue(value) {
        this.value = value;
        this.tileElem.textContent = value;
        const bgLigh = 100 - Math.log2(value)*9;
        this.tileElem.style.setProperty("--bg-ligh", `${bgLigh}%`);
        this.tileElem.style.setProperty("--text-ligh", `${bgLigh < 50 ? 80: 20}%`);
    }

    removeFromDOM() {
        this.tileElem.remove();
    }

    waitForTransitionEnd() {
        return new Promise(resolve =>{
            this.tileElem.addEventListener("transitionend", resolve, {once: true});
        })
    }

    waitForAnimationEnd() {
        return new Promise(resolve =>{
            this.tileElem.addEventListener("animationend", resolve, {once: true});
        })
    }
}