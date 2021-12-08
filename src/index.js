const ethers = require("ethers")
const abi = require("./abi.json")
const fs = require("fs")

const START_ID = 9000
const END_ID = 10000

const tallyDatabase = require("./tally/tally-100.json")

const provider = new ethers.providers.JsonRpcProvider("https://mainnet-nethermind.blockscout.com/")
const lootContract = new ethers.Contract("0x1dfe7Ca09e99d10835Bf73044a23B73Fc20623DF", abi, provider)

const tally = (part, value) => {
    tallyDatabase[part][value] = tallyDatabase[part][value] > 0 ? tallyDatabase[part][value] + 1 : 1
}

const main = async () => {
    for (let i = START_ID; i < END_ID; i++) {
        const [chest, foot, hand, head, neck, ring, waist, weapon] = await Promise.all([
            lootContract.getChest(i),
            lootContract.getFoot(i),
            lootContract.getHand(i),
            lootContract.getHead(i),
            lootContract.getNeck(i),
            lootContract.getRing(i),
            lootContract.getWaist(i),
            lootContract.getWeapon(i),
        ])
        tally("chest", chest)
        tally("foot", foot)
        tally("hand", hand)
        tally("head", head)
        tally("neck", neck)
        tally("ring", ring)
        tally("waist", waist)
        tally("weapon", weapon)
        console.log("completed ", i)
    }
    fs.writeFileSync("./src/tally/tally-100.json", JSON.stringify(tallyDatabase))
}

main()