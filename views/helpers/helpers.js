function section(name, options){
    if(!this._sections) this._sections = {};
    this._sections[name] = options.fn(this);
    return null;
}

function isNull(variavel) {
    return variavel == null;
}


module.exports = {
    section: section,
    isNull: isNull
}