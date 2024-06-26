import {frameRatio, moveToFrame} from './calc';
import {hyper, hyperShift} from './config';
import {cycleBackward, cycleForward} from './cycle';
import {onKey} from './key';
import log from './logger';
import {applyMargin, showCenterOn, titleModal} from './modal';
import {Scanner} from './scan';
import {screenAt} from './screen';
import {sleep} from './util';
import {setFrame, toggleMaximized} from './window';

const scanner = new Scanner();

Phoenix.set({
	daemon: false,
	openAtLogin: true,
});
// only triggers on actual screen change: doesn't trigger on changing focus to another screen
Event.on('screensDidChange', () => {
	log('Screens changed');
});
// function resize(win: Window) {
// 	return;
// }
// Smaller app sizes:
// Messages.app 1/6th width 1/2 height (ideal size)
// Terminal app
function leftHalf(win: Window) {
	const {width, height, x, y} = win.screen().flippedVisibleFrame();
	const frame2 = {width: Math.floor(width / 2), height, x, y};
	setFrame(win, frame2);
}
function rightHalf(win: Window) {
	const {width, height, x, y} = win.screen().flippedVisibleFrame();
	const frame2 = {
		width: Math.floor(width / 2),
		height,
		x: x + Math.ceil(width / 2),
		y,
	};
	setFrame(win, frame2);
}
function leftThird(win: Window) {
	const {width, height, x, y} = win.screen().flippedVisibleFrame();
	const frame2 = {width: Math.floor(width / 3), height, x, y};
	setFrame(win, frame2);
}
function rightThird(win: Window) {
	const {width, height, x, y} = win.screen().flippedVisibleFrame();
	const frame2 = {
		width: Math.floor(width / 3),
		height,
		x: Math.ceil((2 * width) / 3),
		y,
	};
	setFrame(win, frame2);
}
function centerThird(win: Window) {
	const {width, height, x, y} = win.screen().flippedVisibleFrame();
	const frame2 = {
		width: Math.floor(width / 3),
		height,
		// x: x + Math.ceil(width / 2),
		x: x + width / 2 - win.frame().width / 2,
		y,
	};
	setFrame(win, frame2);
}
onKey('=', hyperShift, () => {
	// wider
	let win = Window.focused();
	if (!win) {
		return;
	}

	const {width, height, x, y} = win.frame();
	const screenWidth = win.screen().flippedVisibleFrame().width;
	let newX = x - Math.ceil(screenWidth / 50); // x-half change in width
	let newWidth = width + Math.floor(screenWidth / 25);
	if (newX < 0) {
		newX = 0;
		newWidth -= Math.floor(screenWidth / 50);
	}
	const widerFrame = {
		width: newWidth,
		height,
		x: newX,
		y,
	};

	setFrame(win, widerFrame);
});
// thinner
// TODO make this robust. the below fnc and above fnc
onKey('-', hyperShift, () => {
	let win = Window.focused();
	if (!win) {
		return;
	}

	const {width, height, x, y} = win.frame();
	const screenWidth = win.screen().flippedVisibleFrame().width;
	const thinnerFrame = {
		width: width - Math.floor(screenWidth / 25),
		height,
		x: x + Math.ceil(screenWidth / 50),
		y,
	};

	setFrame(win, thinnerFrame);
});
// (Jump to next screen whilst keeping relative size and placement)
onKey('tab', hyper, async () => {
	// todo window ordering from wins is bad. change.
	// Keep in mind
	// Array<Window> neighbours(String direction) // or neighbors(...)
	const screens = Screen.all();
	// if (1 screen) {
	if (screens.length === 1) {
		const wins = Screen.main().windows({visible: true});
		// arrange them
		if (wins.length === 2) {
			leftHalf(wins[0]);
			rightHalf(wins[1]);
		}
		if (wins.length === 3) {
			leftThird(wins[0]);
			centerThird(wins[2]);
			rightThird(wins[1]);
		}
		if (wins.length === 4) {
		}
		Phoenix.log('YO');
		Phoenix.log(Screen.main().windows({visible: true}).length);
	}
	// if (2+ screens) {
	else {
		let win = Window.focused();
		if (!win) {
			return;
		}
		const fullscreen = win.isFullScreen();
		if (fullscreen) {
			win.setFullScreen(false);
			// If we don't wait until the animation is finished,
			// bad things will happen (at least with VS Code).
			//
			// 750ms seems to work, but just to be safe.
			await sleep(900);
		}
		const oldScreen = win.screen();
		const newScreen = oldScreen.next();

		if (oldScreen.isEqual(newScreen)) {
			return;
		}

		const ratio = frameRatio(
			oldScreen.flippedVisibleFrame(),
			newScreen.flippedVisibleFrame(),
		);
		setFrame(win, ratio(win.frame()));

		if (win) {
			toggleMaximized(win);
		}

		if (fullscreen) {
			await sleep(900);
			win.setFullScreen(true);
		}
		// Force space switch, in case another one is focused on the screen.
		win.focus();
	}
});
// (Jump focused window to next screen whilst maintaining current window size)
onKey('tab', hyperShift, () => {
	let win = Window.focused();
	if (!win) {
		return;
	}
	const oldScreen = win.screen();
	const newScreen = oldScreen.next();

	if (oldScreen.isEqual(newScreen)) {
		return;
	}

	const move = moveToFrame(
		oldScreen.flippedVisibleFrame(),
		newScreen.flippedVisibleFrame(),
	);
	setFrame(win, move(win.frame()));
});

onKey(['left', 'j'], hyper, () => {
	let win = Window.focused();
	if (!win) {
		return;
	}
	const {width, height, x, y} = win.screen().flippedVisibleFrame();
	log('HEIGHT', height);
	// TODO apply this to hyper+right also
	// if big screen in focus, give two more downsize options
	if (height === 1415) {
		const frame2 = {width: Math.floor(width / 2), height, x, y};
		const frame3 = {width: Math.floor(width / 3), height, x, y};
		const frame4 = {width: Math.floor(width / 4), height, x, y};
		const frame5 = {width: Math.floor(width / 6), height, x, y};
		const frame6 = {width: Math.floor(width / 8), height, x, y};
		let frame = frame2;
		if (objEq(win.frame(), frame2)) {
			frame = frame3;
		} else if (objEq(win.frame(), frame3)) {
			frame = frame4;
		} else if (objEq(win.frame(), frame4)) {
			frame = frame5;
		} else if (objEq(win.frame(), frame5)) {
			frame = frame6;
		}
		setFrame(win, frame);
	} else {
		const frame2 = {width: Math.floor(width / 2), height, x, y};
		const frame3 = {width: Math.floor(width / 3), height, x, y};
		const frame4 = {width: Math.floor(width / 4), height, x, y};
		let frame = frame2;
		if (objEq(win.frame(), frame2)) {
			frame = frame3;
		}
		if (objEq(win.frame(), frame3)) {
			frame = frame4;
		}

		setFrame(win, frame);
	}
});

onKey(['right', 'l'], hyper, () => {
	let win = Window.focused();
	log(win?.title());
	if (!win) {
		return;
	}

	const {width, height, x, y} = win.screen().flippedVisibleFrame();
	if (height === 1415) {
		const frame2 = {
			width: Math.floor(width / 2),
			height,
			x: x + Math.ceil(width / 2),
			y,
		};
		const frame3 = {
			width: Math.floor(width / 3),
			height,
			x: x + Math.ceil((width / 3) * 2),
			y,
		};
		const frame4 = {
			width: Math.floor(width / 4),
			height,
			x: x + Math.ceil((width / 4) * 3),
			y,
		};
		const frame5 = {
			width: Math.floor(width / 6),
			height,
			x: x + Math.ceil((width / 6) * 5),
			y,
		};
		const frame6 = {
			width: Math.floor(width / 8),
			height,
			x: x + Math.ceil((width / 8) * 7),
			y,
		};
		let frame = frame2;
		if (objEq(win.frame(), frame2)) {
			frame = frame3;
		} else if (objEq(win.frame(), frame3)) {
			frame = frame4;
		} else if (objEq(win.frame(), frame4)) {
			frame = frame5;
		} else if (objEq(win.frame(), frame5)) {
			frame = frame6;
		}

		setFrame(win, frame);
	} else {
		const frame2 = {
			width: Math.floor(width / 2),
			height,
			x: x + Math.ceil(width / 2),
			y,
		};
		const frame3 = {
			width: Math.floor(width / 3),
			height,
			x: x + Math.ceil((width / 3) * 2),
			y,
		};
		const frame4 = {
			width: Math.floor(width / 4),
			height,
			x: x + Math.ceil((width / 4) * 3),
			y,
		};
		let frame = frame2;
		if (objEq(win.frame(), frame2)) {
			frame = frame3;
		} else if (objEq(win.frame(), frame3)) {
			frame = frame4;
		}

		setFrame(win, frame);
	}
});

onKey(['up', 'i'], hyper, () => {
	let win = Window.focused();
	if (!win) {
		return;
	}

	const {width, x} = win.frame();
	let {height, y} = win.screen().flippedVisibleFrame();
	height = Math.ceil(height / 2);

	setFrame(win, {height, width, x, y});
});

onKey(['down', 'k'], hyper, () => {
	let win = Window.focused();
	if (!win) {
		return;
	}

	const {width, x} = win.frame();
	let {height, y} = win.screen().flippedVisibleFrame();
	height /= 2;
	[height, y] = [Math.ceil(height), y + Math.floor(height)];

	setFrame(win, {height, width, x, y});
});

onKey('return', hyper, () => {
	let win = Window.focused();
	if (!win) {
		return;
	}

	if (win) {
		toggleMaximized(win);
	}
});

onKey(['left', 'j'], hyperShift, () => {
	let win = Window.focused();
	if (!win) {
		return;
	}

	const {width, height, y, x: fX} = win.frame();
	// let {width: sWidth, x} = win.screen().flippedVisibleFrame();
	//
	// const center = x + Math.ceil(sWidth / 2);
	// const half = Math.floor(width / 2);
	// if (fX + half > center) {
	// 	x = center - half;
	// }
	//
	// setFrame(win, {width, height, y, x});
	let {x} = win.screen().flippedVisibleFrame();
	// TODO(mafredri): Move to next screen when at the edge.
	setFrame(win, {width, height, y, x: Math.max(x, fX - width)});
});

onKey(['right', 'l'], hyperShift, () => {
	let win = Window.focused();
	if (!win) {
		return;
	}

	const {width, height, y, x: fX} = win.frame();
	let {width: sWidth, x} = win.screen().flippedVisibleFrame();

	// const center = x + Math.floor(sWidth / 2);
	// const half = Math.ceil(width / 2);
	// if (fX + half < center) {
	// 	x = center - half;
	// } else {
	// 	x = x + sWidth - width;
	// }
	//
	// setFrame(win, {width, height, y, x});
	const sEdge = x + sWidth - width;
	setFrame(win, {
		width,
		height,
		y,
		x: Math.min(sEdge, fX + width),
	});
});

onKey(['up', 'i'], hyperShift, () => {
	let win = Window.focused();
	if (!win) {
		return;
	}

	const {width, height, x, y: frameY} = win.frame();
	// let {height: sHeight, y} = win.screen().flippedVisibleFrame();
	//
	// const center = Math.ceil(y + sHeight / 2);
	// const half = Math.floor(height / 2);
	// if (frameY + half > center) {
	// 	y = center - half;
	// }
	// setFrame(win, {width, height, x, y});
	let {y} = win.screen().flippedVisibleFrame();
	// TODO(mafredri): Move to next screen when at the edge.
	setFrame(win, {width, height, x, y: Math.max(y, frameY - height)});
});

onKey(['down', 'k'], hyperShift, () => {
	let win = Window.focused();
	if (!win) {
		return;
	}

	const {width, height, x, y: frameY} = win.frame();
	let {height: sHeight, y} = win.screen().flippedVisibleFrame();

	// const center = Math.floor(y + sHeight / 2);
	// const half = Math.ceil(height / 2);
	// if (frameY + half < center) {
	// 	y = center - half;
	// } else {
	// 	y = y + sHeight - height;
	// }
	//
	// setFrame(win, {width, height, x, y});
	const sEdge = y + sHeight - height;
	// TODO(mafredri): Move to next screen when at the edge.
	setFrame(win, {width, height, x, y: Math.min(sEdge, frameY + height)});
});

onKey('return', hyperShift, () => {
	let win = Window.focused();
	if (!win) {
		return;
	}

	const {width, height} = win.frame();
	const {
		width: sWidth,
		height: sHeight,
		x,
		y,
	} = win.screen().flippedVisibleFrame();

	setFrame(win, {
		height,
		width,
		x: x + sWidth / 2 - width / 2,
		y: y + sHeight / 2 - height / 2,
	});
	// 	TODO for any windows beneath, swap. put them in the space the window that is now covering em used to be
	// for all visible windows
	const wins = Screen.main().windows({visible: true});
	// todo which ones are now underneath?
});
// maximum height
onKey('h', hyperShift, () => {
	let win = Window.focused();
	if (!win) {
		return;
	}

	const {width, x} = win.frame();
	const {height, y} = win.screen().flippedVisibleFrame();
	const finalRect = {
		x,
		y,
		width,
		height,
	};
	log('GARSH');
	setFrame(win, finalRect);
});

// onKey('p', hyper, () => {
// 	let win = Window.focused();
// 	if (!win) {
// 		return;
// 	}
// 	const app = win.app().name();
// 	const bundleId = win.app().bundleIdentifier();
// 	const pid = win.app().processIdentifier();
// 	const title = win.title();
// 	const frame = win.frame();
// 	const msg = [
// 		`Application: ${app}`,
// 		`Title: ${title}`,
// 		`Frame: X=${frame.x}, Y=${frame.y}`,
// 		`Size: H=${frame.height}, W=${frame.width}`,
// 		`Bundle ID: ${bundleId}`,
// 		`PID: ${pid}`,
// 	].join('\n');
//
// 	log('Window information:\n' + msg);
//
// 	const modal = Modal.build({
// 		duration: 10,
// 		icon: win.app().icon(),
// 		text: msg,
// 		weight: 16,
// 	});
// 	showCenterOn(modal, Screen.main());
// });

// onKey('.', hyper, () => {
// 	let win = Window.focused();
// 	if (!win) {
// 		return;
// 	}
// 	if (win) {
// 		log(
// 			win
// 				.screen()
// 				.windows({visible: true})
// 				.map((w) => w.title()),
// 		);
// 		log(
// 			win
// 				.screen()
// 				.windows()
// 				.map((w) => w.title()),
// 		);
// 	}
// });

onKey('m', hyperShift, () => {
	let win = Window.focused();
	if (!win) {
		return;
	}
	Phoenix.log('MINIMIZE CODE');
	log('MINIMIZE CODE');
	if (win) {
		const visible = win.screen().windows({visible: true});
		log(visible.map((w) => w.title()));
		// log(win.screen().windows({visible: true}).map(w => w.title()));
		// log(win.others({visible: true}).map(w => w.title()));
		win.minimize();
		if (visible.length) {
			const next = visible[visible.length > 1 ? 1 : 0];
			log('focusing: ' + next.title());
			next.focus();
		}
		// win.focusClosestNeighbor('east');
		// const others = win.others({visible: true});
		// if (others.length) {
		// 	log(others.map(w => w.title()));
		// 	others[0].focus();
		// }
	}
});

onKey('escape', ['cmd'], () => {
	const win = Window.focused();
	cycleForward(win);
});

onKey('escape', ['cmd', 'shift'], () => {
	const win = Window.focused();
	cycleBackward(win);
});

// Always hide apps, even if they're the last one on the desktop.
onKey('h', ['cmd'], (_: Key, repeated: boolean) => {
	// Hide all windows when Cmd+H is held.
	if (repeated) {
		const apps = Window.all({visible: true}).map((w) => w.app());
		new Set(apps).forEach((a) => a.hide());
		return;
	}

	let win = Window.focused();
	if (!win) {
		return;
	}

	if (win) {
		win.app().hide();
	}
});

function objEq(a: {[key: string]: any}, b: {[key: string]: any}) {
	const akeys = Object.keys(a);
	if (akeys.length !== Object.keys(b).length) {
		return false;
	}
	return akeys.every((k) => a[k] === b[k]);
}

const phoenixApp = App.get('Phoenix') || App.get('Phoenix (Debug)');
titleModal('Phoenix (re)loaded!', 2, phoenixApp && phoenixApp.icon());
