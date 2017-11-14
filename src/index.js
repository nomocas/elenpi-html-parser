export default class Dummy {
	constructor (name='batman') {
		this.name = name;
	}

	helloMessage () {
		const msg = `hello ${this.name}`;
		return msg;
	}

	sayHello () {
		console.log(this.helloMessage()); // eslint-disable-line no-console
	}
}
