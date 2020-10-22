/**
 * Hash function used to compute the hash code of a given key.
 *
 * @callback hashFunction
 * @param {*} key The object used to act as a key.
 */


class HashCollection {
	/**
	 * The hash function used to compute the hash code of a given key.
	 * @type hashFunction
	 */
	#hashKey;

	/**
	 * 
	 * @param {hashFunction} hashCodeFunction Hash function used to compute the hash code of a given key.
	 */
	constructor(hashCodeFunction) {
		this.#setHashFunction(hashCodeFunction);
	}

	/**
	 * The hash function used to compute the hash code of a given key.
	 * @type hashFunction
	 */
	get hashKey() {
		return this.#hashKey;
	}

	#setHashFunction(hashCodeFunction) {
		if (!(typeof hashCodeFunction === "function")) {
			throw new TypeError("hash function is not a function");
		}

		this.#hashKey = hashCodeFunction;
	}
}

class HashMap extends HashCollection {
	static #Entry = class Entry {
		key;
		value;

		constructor(key, value) {
			this.key = key;
			this.value = value;
		}
	}

	/**
	 * @type Map<*, HashMap.#Entry>
	 */
	#hashCodeMap = new Map();

	get(key) {
		const hashCode = this.hashKey(key);
		return this.#hashCodeMap.get(hashCode).value;
	}

	set(key, value) {
		const hashCode = this.hashKey(key);

		const mapValue = new HashMap.#Entry(key, value);
		this.#hashCodeMap.set(hashCode, mapValue);
		return this;
	}

	delete(key) {
		const hashCode = this.hashKey(key);
		return this.#hashCodeMap.delete(hashCode);
	}

	has(key) {
		const hashCode = this.hashKey(key);
		return this.#hashCodeMap.has(hashCode);
	}

	clear() {
		this.#hashCodeMap.clear();
		return this;
	}

	forEach(callback, thisArg) {
		for (const [key, value] of this.entries()) {
			callback.apply(thisArg, [key, value, this]);
		}
		return this;
	}

	[Symbol.iterator]() {
		return this.entries();
	}

	* entries() {
		for (const {key, value} of this.#hashCodeMap.values()) {
			yield [key, value];
		}
	}

	* keys() {
		for (const entry of this.#hashCodeMap.values()) {
			yield entry.key;
		}
	}

	* values() {
		for (const entry of this.#hashCodeMap.values()) {
			yield entry.value;
		}
	}
}

class HashSet extends HashCollection {
	#hashCodeMap = new Map();

	add(key) {
		const hashCode = this.hashKey(key);
		this.#hashCodeMap.set(hashCode, key);
		return this;
	}

	delete(key) {
		const hashCode = this.hashKey(key);
		return this.#hashCodeMap.delete(hashCode);
	}

	has(key) {
		const hashCode = this.hashKey(key);
		return this.#hashCodeMap.has(hashCode);
	}

	clear() {
		this.#hashCodeMap.clear();
		return this;
	}

	forEach(callback, thisArg) {
		for (const [key, value] of this.entries()) {
			callback.apply(thisArg, [key, value, this]);
		}
		return this;
	}

	[Symbol.iterator]() {
		return this.values();
	}

	* entries() {
		for (const value of this.#hashCodeMap.values()) {
			yield [value, value];
		}
	}

	values() {
		return this.#hashCodeMap.values();
	}
}