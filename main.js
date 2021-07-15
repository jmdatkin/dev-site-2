function TextTyper(text) {
    this.fullText = text;
    this.idx = 0;
    this.currentText = '';
    this.toAppend = '_'


}

TextTyper.prototype.nextChar = function () {
    if (this.idx >= this.fullText.length) return this.fullText + this.toAppend;
    // this.startCursorBlink();
    this.currentText = this.fullText.substring(0, this.idx + 1) + this.toAppend;
    this.idx++;
    return this.currentText;
};

TextTyper.prototype.startCursorBlink = function () {
    window.clearInterval(this.iid);
    this.iid = window.setInterval(() => {
        this.toAppend = this.toAppend !== '' ? '' : '_';
    }, 1100);
};

Array.from(document.querySelectorAll(".typed")).forEach(el => {
    // window.setInterval(
    let t = 200;
    let r = 400;

    let getTime = () => {
        let time = t + (Math.floor(Math.random() * r) - r / 2);
        return time;

    };

    let fxn = (() => {
        let t = new TextTyper(el.textContent);
        return () => {
            el.textContent = t.nextChar();
        };
    })();        // })(), 200);

    let startTimeout = () => {
        fxn();
        window.setTimeout(startTimeout, getTime());
    };
    window.setTimeout(startTimeout, getTime());
});



const TypedNameplate = (function() {
    let value = "";

    let generateTiming = function(base,delta) {
        return Math.floor(Math.random()*2*delta + base - delta);
    };


})();





const $ = e => document.querySelector(e);

class AnimatedComponent {
    constructor(el, param_anims) {
        this.target = el;
        this.anims = {};

        if (param_anims) {
            this.registerAnims(param_anims);
        }
    }

    registerAnims(param_anims) {
        Object.keys(param_anims).forEach(key => {
            this.registerAnim(key,param_anims[key]);
        });
    }

    registerAnim(tag, anim) {
        let self = this;
        this.anims[tag] = () => {
            anim(self.target);
        };
    }

    get(anim) {
        if (this.anims.hasOwnProperty(anim))
            return this.anims[anim];
        console.error(`Error: Get animation ${anim} not found`);
        return;
    }
}

class RouteAnim {
    constructor() {
        this._in = [];
        this._out = [];
    }

    in(fxn) {
        if (Array.isArray(fxn))
            this._in.push(...fxn);
        else
            this._in.push(fxn);
    }

    out(fxn) {
        if (Array.isArray(fxn))
            this._out.push(...fxn);
        else
            this._out.push(fxn);
    }
}

class Router {
    constructor() {
        this.routes = {};
        this.current = 'home';
    }

    registerRoute(route, params) {
        if (typeof route !== 'string') return;

        this.routes[route] = new RouteAnim();

        if (params) {
            if (params.hasOwnProperty('in')) {
                if (Array.isArray(params.in)) {
                    this.routes[route].in(params.in);
                }
            }
            if (params.hasOwnProperty('out')) {
                if (Array.isArray(params.out)) {
                    this.routes[route].out(params.out);
                }
            }
        }
    }

    follow(newRoute) {
        this.routes[this.current]._out.forEach(fxn => fxn());   //Call out on old route
        this.routes[newRoute]._in.forEach(fxn => fxn());        //Call in on new route
        this.current = newRoute;                                //Update ref to new route
    }
}

const router = new Router();

const nameplate = new AnimatedComponent();

const linkSelectAnimations = {
    'linkSelectIn': el => {
        el.classList.add("link-selected");
    },
    'linkSelectOut': el => {
        el.classList.remove("link-selected");
    }
};

const hideUnhideAnimations = {
    'hide': el => {
        el.classList.add("hidden");
        el.classList.add("nodisplay");
    },
    'unhide': el => {
        (a => {
            el.classList.remove("nodisplay");
            setTimeout(a,1);
            // a();
        })(() => el.classList.remove("hidden"));
        // el.classList.remove("hidden");
        // el.addEventListener('transitionend', function(e) {
        //     console.log("transitionend fired");
        //     console.log("setting display to initial");
        //     el.classList.remove("nodisplay");
        //     // el.removeEventListener('transitionend', this);
        // });
    }
};

const homeButton = new AnimatedComponent($("#link-home"));
homeButton.registerAnims(linkSelectAnimations);


const projectsButton = new AnimatedComponent($("#link-projects"));
projectsButton.registerAnims(linkSelectAnimations);


const contactButton = new AnimatedComponent($("#link-contact"));
contactButton.registerAnims(linkSelectAnimations);


const bigHeader = new AnimatedComponent($(".big-header-wrapper"));


const socialInfo = new AnimatedComponent($(".route-content-social"));
socialInfo.registerAnims(hideUnhideAnimations);

const homeInfo = new AnimatedComponent($(".route-content-home"));
homeInfo.registerAnims(hideUnhideAnimations);

const projectsInfo = new AnimatedComponent($(".route-content-projects"));
projectsInfo.registerAnims(hideUnhideAnimations);

const [ headerColorHome, headerColorProjects, headerColorSocial ] = ['#1b69bd', '#dbbc5f', 'transparent'];

//  Router registration
router.registerRoute("home", {
    in: [
        homeButton.get('linkSelectIn'),
        homeInfo.get("unhide")
    ],
    out: [
        homeButton.get('linkSelectOut'),
        homeInfo.get("hide")
    ]
});

router.registerRoute("projects", {
    in: [
        projectsButton.get('linkSelectIn'),
        projectsInfo.get("unhide")
    ],
    out: [
        projectsButton.get('linkSelectOut'),
        projectsInfo.get("hide")
    ]
});

router.registerRoute("contact", {
    in: [
        contactButton.get('linkSelectIn'),
        socialInfo.get("unhide")
    ],
    out: [
        contactButton.get('linkSelectOut'),
        socialInfo.get("hide")
    ]
});



//  MOUSE EVENTS
homeButton.target.href = "#home";
// homeButton.target.addEventListener("click", function () {
//     router.follow("home");
// });

projectsButton.target.href = "#projects";
contactButton.target.href = "#contact";

// $("#link-projects").addEventListener("click", function () {
//     router.follow("projects");
// });

// $("#link-contact").addEventListener("click", function () {
//     router.follow("contact");
// });


document.body.addEventListener("keydown", (e) => {
    if (e.key === 'ArrowRight') {
        if (router.current === 'home')
            projectsButton.target.click();
        else if (router.current === 'projects')
            contactButton.target.click();
        else
            homeButton.target.click();
    } else if (e.key === 'ArrowLeft') {
        if (router.current === 'contact')
            projectsButton.target.click();
        else if (router.current === 'projects')
            homeButton.target.click();
        else
            contactButton.target.click();
    }
});

window.addEventListener('hashchange', e => {
    console.log(e.target.location.hash);
    e.preventDefault();
    router.follow(e.target.location.hash.substr(1));
});

if (window.location.hash)
    router.follow(window.location.hash.substr(1));

// let path = window.location.split("/");
// let subpath = path[path.length-1];

// router.follow(subpath);//'home');