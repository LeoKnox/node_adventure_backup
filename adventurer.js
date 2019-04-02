class Adventurer {
    constructor(advent) {
        this.name=advent
    }

    melee() {
        return(this.name + '! Think of the experience!')
    }

    block() {
        return('Is not a defense against a grue!')
    }

    magic() {
        return('I cast zone of truth')
    }

    panic() {
        return('Ahhhhhhhhhh!')
    }
}

module.exports = Adventurer;