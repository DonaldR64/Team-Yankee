
let chars = findObjs({
    _pageid: Campaign().get("playerpageid"),
    _type: "character",
})

chars.forEach((char) => {
    let revised = Attribute(char,"revised");
    if (revised === "Done") {
        return;
    } else {
        log(char.name)
        AttributeSet(char.id,"revised","True");
        let attributeArray = AttributeArray(char.id);
        for (let i=1;i<5;i++) {
            let name = attributeArray["weapon"+i+"name"];
            if (!name || name == " " || name == "") {continue};
            let range = attributeArray["weapon"+i+"range"];
            range = range.split("-");
            if (range.length > 1) {
                range[0] = Math.round(parseInt(range[0])/2);
                range[1] = Math.floor(parseInt(range[1] * 2.5));
                range = range[0] + "-" + range[1];
            } else {
                range = Math.floor(parseInt(range[1] * 2.5));
            }
            AttributeSet(char.id,"weapon"+i+"range",range)
        }
    }
})


