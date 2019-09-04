// nb: class is not used for now, maybe can be convenient in future

module.exports = () => {
	return {
		initialize: initialize
	}
}

function initialize() {
	// strings
	String.prototype.hashCode = function () {
		for (var result = 0, i = 0, len = this.length; i < len; i++) {
			result = (31 * result + this.charCodeAt(i)) << 0;
		}
		return result;
	};

	// arrays
	Array.prototype.contains = function (v) {
		for (var i = 0; i < this.length; i++) {
			if (this[i] === v) return true;
		}
		return false;
	};

	Array.prototype.unique = function () {
		var arr = [];
		for (var i = 0; i < this.length; i++) {
			if (!arr.includes(this[i])) {
				arr.push(this[i]);
			}
		}
		return arr;
	}
}