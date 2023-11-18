const TY = (() => { 
    const version = '3.11.15';
    if (!state.TY) {state.TY = {}};
    //Constants and Persistent Variables

    const pageInfo = {name: "",page: "",gridType: "",scale: 0,width: 0,height: 0};
    const rowLabels = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","AA","BB","CC","DD","EE","FF","GG","HH","II","JJ","KK","LL","MM","NN","OO","PP","QQ","RR","SS","TT","UU","VV","WW","XX","YY","ZZ","AAA","BBB","CCC","DDD","EEE","FFF","GGG","HHH","III","JJJ","KKK","LLL","MMM","NNN","OOO","PPP","QQQ","RRR","SSS","TTT","UUU","VVV","WWW","XXX","YYY","ZZZ"];

    let TerrainArray = {};
    let TeamArray = {}; //Individual Squads, Tanks etc
    let UnitArray = {}; //Units of Teams eg. Platoon
    let FormationArray = {}; //to track formations
    let SmokeArray = [];
    let FoxholeArray = [];
    let CheckArray = []; //used by Remount, Rally and Morale checks
    let RangedInArray = {};
    let WreckArray = {};//used for night vision

    let unitCreationInfo = {}; //used during unit creation 
    let unitIDs4Saves = {}; //used during shooting routines
    let AssaultIDs = [[],[]]; //array of teams (IDs) in a CC, updated when charge/move
    let deadHQs = [[],[]]; //formationIDs of any formations that lost leaders in prev. turn, by player

    const TurnMarkers = ["","https://s3.amazonaws.com/files.d20.io/images/361055772/zDURNn_0bbTWmOVrwJc6YQ/thumb.png?1695998303","https://s3.amazonaws.com/files.d20.io/images/361055766/UZPeb6ZiiUImrZoAS58gvQ/thumb.png?1695998303","https://s3.amazonaws.com/files.d20.io/images/361055764/yXwGQcriDAP8FpzxvjqzTg/thumb.png?1695998303","https://s3.amazonaws.com/files.d20.io/images/361055768/7GFjIsnNuIBLrW_p65bjNQ/thumb.png?1695998303","https://s3.amazonaws.com/files.d20.io/images/361055770/2WlTnUslDk0hpwr8zpZIOg/thumb.png?1695998303","https://s3.amazonaws.com/files.d20.io/images/361055771/P9DmGozXmdPuv4SWq6uDvw/thumb.png?1695998303","https://s3.amazonaws.com/files.d20.io/images/361055765/V5oPsriRTHJQ7w3hHRBA3A/thumb.png?1695998303","https://s3.amazonaws.com/files.d20.io/images/361055767/EOXU3ujXJz-NleWX33rcgA/thumb.png?1695998303","https://s3.amazonaws.com/files.d20.io/images/361055769/925-C7XAEcQCOUVN1m1uvQ/thumb.png?1695998303","https://s3.amazonaws.com/files.d20.io/images/367683734/l-zY78IZqDwwBmvKudj7Fg/thumb.png?1699992368","https://s3.amazonaws.com/files.d20.io/images/367683736/KTSyH0bTNRtF06h8F3t0kQ/thumb.png?1699992368","https://s3.amazonaws.com/files.d20.io/images/367683726/MCFihVq52aTlUkv-ijdg6w/thumb.png?1699992367","https://s3.amazonaws.com/files.d20.io/images/367683728/YUy1bSEu44Hu_HlVSzv6ZQ/thumb.png?1699992367","https://s3.amazonaws.com/files.d20.io/images/367683730/pw5PgLNFCkExUtJA4JwM1Q/thumb.png?1699992367","https://s3.amazonaws.com/files.d20.io/images/367683729/wF4gNH1WKg9xB_OSrAkxsg/thumb.png?1699992367","https://s3.amazonaws.com/files.d20.io/images/367683727/PVrwoByB_5PETsd9ObPQlA/thumb.png?1699992367","https://s3.amazonaws.com/files.d20.io/images/367683732/g8kknD1sqvInESGM1X6itg/thumb.png?1699992367","https://s3.amazonaws.com/files.d20.io/images/367683731/N3KKC6lLhlZ59KOqtdQzFw/thumb.png?1699992367"];

    let hexMap = {}; 
    let edgeArray = [];
    const DIRECTIONS = ["Northeast","East","Southeast","Southwest","West","Northwest"];
    const Colours = {
        green: "#00ff00",
        lightblue: "#00ffff",
        purple: "#800080",
        brown: "#980000",
        red: "#ff0000",
        yellow: "#ffff00",
        orange: "#ff9900",
        darkblue: "#0000ff",
        lightpurple: "#ff00ff",
        black: "#000000",
    }

    const SM = {
        "defensive": "status_green",
        "surprised": "status_yellow",
        "HQ": "status_black-flag",
        "oneshot": "status_oneshot::5503748",
    };

    const NightVision = {
        IR: 20,
        Gen1Thermal: 20,
        Gen2Thermal: 40,
    }

    let specialInfo = {
        "Air Assault": "An Air Assault Unit may only be held in Reserve if all the Units deployed on table are Air Assault Units",
        "Accurate": 'No Penalties for Long Range if Shooter did not Move',
        "Advanced Stabiliser": 'Tactical Speed is 7 hexes. Machineguns cannot Shoot and the Team cannot Assault if it moves more than 5 hexes',
        "Amphibious": "Treat Impassable Water as Difficult Terrain",
        "Anti-Helicopter": "Can shoot at Helicopters with a ROF of 1",
        "Applique Armour": 'Front and Side Armour is 13 against HEAT weapons',
        "Bazooka Skirts": "Front and Side Armour is minimum 10 against HEAT Weapons",
        "BDD Armour": "Front and Side Armour is minimum 13 against HEAT Weapons",
        "Bomblets": "Bomblets scatter over a wider area, using a SALVO template",
        "Brutal": "Infantry, Gun and Unarmoured Tank Teams re-roll successful Saves against Brutal Weapons",
        "Chobham Armour": "Front and Side Armour is minimum 16 vs HEAT weapons",
        "Dedicated AA": "Uses normal ROF when firing at Aircraft/Helicopters",
        "Dragon Mount": "The vehicle may fire the weapon if a Passenger with the weapon is mounted",
        "ERA": "Front and Side Armour is minimum 16 against HEAT Weapons",
        "Flamethrower": "Infantry, Gun, and Unarmoured Tank Teams re-roll successful Saves when hit by a Flame-thrower and the Unit is automatically Pinned Down. Armoured Tank Teams use their Top armour for Armour Saves when hit by a Flame-thrower.",
        "Forward Firing": "Forward Firing Weapons can only target Teams fully in front of the Shooter",
        "Guided": 'No Penalties for Long Range. Cannot hit Infantry unless they are stationary in Bulletproof Cover',
        "Guided AA": 'Guided Weapons that cannot target Tank or Infantry Teams. No penalty to Hit for Long Range. Always shoots at Halted ROF',
        "Gun Shield": "Gives Bulletproof Cover when shot at from the Front. No protection against Bombardments or if the Team moved at Dash speed",
        "Hammerhead": "Team with a Hammerhead can remain Gone to Ground while shooting its missile",
        "HEAT": 'Target Armour is not increased for Long Range. Affected by BDD, Skirts, Chobham and ERA Armour',
        "Heavy Weapon": "A Heavy Weapon Team cannot Charge into Contact",
        "HQ": "Always In Command and ignores Morale Checks",
        "Hunter-Killer": "Hunter-Killer Helicopters can use terrain for Concealment and are Gone to Ground unless they Shoot",
        "Independent": "Independent Teams can use the Mistaken Target rule to reassign hits to nearby Units, but cannot Charge into Contact or take an Objective",        
        "Infra-Red": "Can see out to a distance of 1000m (20 hexes) at night",
        "Jump Jet": "Enters the table on a score of 3+",
        "Large Gun": 'Cannot be placed in Buildings and cannot be placed from Ambush within 4 hexes of enemy',
        "Laser Rangefinder": 'No Penalties for Long Range',
        "Laser Guided Projectiles": "Must be guided by an Observer, using it for LOS",
        "Limited 1": "Each time the Unit  shoots, one of its Teams may shoot this weapon rather than its usual weapons",
        "Mine Clearing Device": "Team can attempt to clear Minefields",
        "Minelets": "Once per game, the Unit can fire Minelets",
        "MLRS": "Multiple Launching Rocket System - each Team counts as two Teams firing",
        "Mounted": "Can fire a Mounted Weapon if a Passenger has that weapon",
        "Napalm": "Infantry, Gun, and Unarmoured Tank Teams re-roll successful Saves when hit by Napalm bombs. Armoured Tank Teams use their Top armour for Armour Saves when hit by Napalm bombs",
        "NLOS": 'A weapon with NLOS has no To Hit Penalty for Long Range and does not require LOS. The Target Team always counds as Concealed even when in LOS. NLOS weapons cannot hit Infantry Teams unless the Infantry are stationary and in bulletproof cover',
        "No HE": "A weapon with no HE targetting an Infantry or Gun Team add +1 to the score needed To Hit",
        "Observer": "An Observer Team can Spot for any friendly Artillery Unit and reduces the score required to Range In by 1",
        "One Shot": "Can only be used once per game",
        "Overhead Fire": "Grenade Launchers and Light Mortars capable of Overhead Fire can fire over friendly teams and Short Terrain",
        "Overworked": "Overworked weapons add +1 to the score needed To Hit when moving",
        "Passengers (X)": "Vehicle can carry X Teams as Passengers",
        "Pinned ROF 1": "These weapons have a ROF of 1 when Pinned Down",
        "Pioneers": 'Can cross Minefields safely on a 2+. If remain in Minefield and not Pinned Down, clear the Minefield automatically',
        "Radar": 'When shooting at Aircraft/Helicopters, weapon range is increased by 6 hexes and there are no penalties for Long Range',
        "Salvo": "Use a larger Artillery Template",
        "Scout": "Scouts are Gone to Ground unless they Shoot or Assault",
        "Self Defence AA": "Self-Defence AA weapons can Shoot at Aircraft with ROF 1",
        "Slow Firing": "Slow Firing Weapons add +1 to the score needed To Hit when moving",
        "Smoke": "Smoke weapons can Shoot Smoke ammunition",
        "Smoke Bombardment": "Once per game, the weapon can fire a Smoke Bombardment",
        "Sneak and Peek": 'A Team with Sneak and Peek can move 5 hexes if it is not firing its Main Gun',
        "Spearhead": "Special Rules for Deployment (page 93)",
        "Stabiliser": 'Tank can move 7 hexes at Tactical, gaining a +1 penalty To Hit. Machineguns cannot Shoot and the Team cannot Assault if it moves more than 5 hexes',
        "Swingfire": "Team firing Swingfire Missiles can remain Gone to Ground",
        "Tandem Warhead": "Tandem Warhead HEAT weapons are unaffected by ERA Armour",
        "Thermal Imaging": "Visibility to 1000m (20 hexes) at night. No To Hit penalties for Night and Smoke",
        "2nd Gen Thermal Imaging": "Visibility to 2000m (40 hexes) at night. No To Hit penalties for Night and Smoke",
        "Tractor": "A Tractor Team can tow a single Gun Team as a Passenger, placing the Gun Team behind it",
        "Unarmoured": "An Unarmoured Tank Team cannot Charge into Contact and must Break Off if Assaulted",
    };

    const SaveResults = {
        "deflect": "Hit deflected by Armour",
        "minor": "Hit caused Minor damage only",
        "destroyed": "[#ff0000]Hit Destroys the Team[/#]",
        "bailed": "[#0000ff]Hit caused Moderate Damage to Vehicle, Crew Suppressed[/#]",
        "bailedAgain": "[#0000ff]Hit caused Moderate Damage to Vehicle, Crew Remains Suppressed[/#]",
        "flees": "[#ff0000]Hit Destroys Tank as the Crew Flees![/#]",
        "saved": "Hit Saved",
        "cover": "Hit Saved by Cover",
        "smoked": "Target Smoked",
    }

    const SaveResultsMult = {
        "deflect": "All Hits deflected by Armour",
        "minor": "Hits cause Minor damage only",
        "destroyed": "[#ff0000]Hits Destroy the Team[/#]",
        "bailed": "[#0000ff]Hits cause Moderate Damage to Vehicle, Crew Suppressed[/#]",
        "bailedAgain": "[#0000ff]Hits cause Moderate Damage to Vehicle, Crew Remains Suppressed[/#]",
        "flees": "[#ff0000]Hits Destroy Tank as the Crew Flees![/#]",
        "saved": "All Hits Saved",
        "cover": "All Hits Saved (Cover)",
    }

    let outputCard = {title: "",subtitle: "",nation: "",body: [],buttons: []};
    const WarsawPact = ["Soviet","Poland","Syria"];
    const NATO = ["US Army","US Marine Corps","British","West Germany","Canada","Israel"];
    const lastStandCount = {"Infantry": 3,"Gun": 2,"Tank": 2,"Unarmoured Tank": 2,"Aircraft": 1,};

    const Ranks = {
                "German": ["Major ","Hauptmann ","Oberleutnant ","Feldwebel "],
                "Western": ["Major ","Captain ","Lieutenant ","Sergeant "],
                "Soviet": ["Podpolkovnik ","Majór ","Kapitán ","Leytnant ","Serzhant "],
                "Arabic": ["Muquddam ","Ra'id ","Naqib ","Mulazim ","Raqib ",]
    };

    //Types: Flat = 0, Short = 1, Tall = 2, Building = 3
    //Dash: Road = 0,Country = 1,Terrain = 2, Tank Obstacle = 3, Impassable = 4

    const TerrainInfo = {
        "#00ff00": {name: "Woods",height: 2,bp: false,type: 2,group: "Woods",dash: 2},
        "#20124d": {name: "Ruins",height: 1,bp: true,type: 1,group: "Rough",dash: 2},
        "#000000": {name: "Hill 1",height:1,bp: false,type: 0,group: "Hill",dash: 1},
        "#434343": {name: "Hill 2",height:2,bp: false,type: 0,group: "Hill",dash: 1},
        "#666666": {name: "Hill 3",height:3,bp: false,type: 0,group: "Hill",dash: 1},
        "#c0c0c0": {name: "Hill 4",height:4,bp: false,type: 0,group: "Hill",dash: 1},
        "#d9d9d9": {name: "Hill 5",height:5,bp: false,type: 0,group: "Hill",dash: 1},
        "#00ffff": {name: "Stream",height: 0,bp: false,type: 0,group: "Water",dash: 2},
        "#b6d7a8": {name: "Scrub",height: 0,bp: false,type: 1,group: "Crops",dash: 2},
        "#980000": {name: "Low Embankment",height: 0.25,bp: false,type: 0,group: "Hill",dash: 2},
        "#ffffff": {name: "Ridgeline",height: .25,bp: true,type: 1,group: "Hill",dash: 1},
        "#ffff00": {name: "Road",height: 0,bp: false,type: 0,group: "Road",dash: 0},
    }

    const MapTokenInfo = {
        "woods": {name: "Woods",height: 2,bp: false,type: 2,group: "Woods",dash: 2},
        "ruins": {name: "Ruins",height: 1,bp: true,type: 1,group: "Rough",dash: 2},
        //"wreck": {name: "Wreck",height: 0,bp: true,type: 1,group: "Obstacle",dash: 2},
        "building 1": {name: "Buildings - Height 1",height: 1,bp: true,type: 3,group: "Building",dash: 2},
        "building 2": {name: "Buildings - Height 2",height: 2,bp: true,type: 3,group: "Building",dash: 2},
        "building 3": {name: "Buildings - Height 3",height: 3,bp: true,type: 3,group: "Building",dash: 2},
        "rubble": {name: "Rubble",height: 0,bp: true,type: 1,group: "Rough",dash: 2},
        //"anti-tank ditch": {name: "Anti-Tank Ditch",height: 0,bp: true,type: 0,group: "Trench",dash: 3},
        //"wall": {name: "Wall",height: 0,bp: true,type: 1,group: "Obstacle",dash: 2},
        "hedge": {name: "Hedge",height: 0,bp: false,type: 1,group: "Obstacle",dash: 2},
        //"bocage": {name: "Bocage",height: 0,bp: true,type: 2,group: "Obstacle",dash: 2},
        //"dragon's teeth": {name: "Dragon's Teeth",height: 0,bp: true,type: 1,group: "Obstacle",dash: 3},
        //"road block": {name: "Road Block",height: 0,bp: true,type: 1,group: "Obstacle",dash: 3},
        "crater": {name: "Craters",height: 0,bp: true,type: 0,group: "Rough",dash: 2},        
        "crops": {name: "Crops",height: 0,bp: false,type: 1,group: "Crops",dash: 2},
        "foxholes": {name: "Foxholes",height: 0,bp: false,type: 0,group: "Foxholes",dash: 2}, //bp tracked in LOS, and in hexMap
        "smoke": {name: "Smoke",height: 0,bp: false,type: 0,group: "Smoke",dash: 1},
        "smokescreen": {name: "SmokeScreen",height: 10,bp:false,type: 0,group: "Smoke",dash: 1},
        "rangedin": {name: "rangedin",height: 0,bp:false,type: 0,group: "Marker",dash: 1},
        "scrub": {name: "Scrub",height: 0,bp: false,type: 1,group: "Crops",dash: 2},
        "stream": {name: "Stream",height: 0,bp: false,type: 0,group: "Water",dash: 2},

    
    }

    const Nations = {
        "Soviet": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/324272729/H0Ea79FLkZIn-3riEhuOrA/thumb.png?1674441877",
            "dice": "Soviet",
            "backgroundColour": "#FF0000",
            "titlefont": "Anton",
            "fontColour": "#000000",
            "borderColour": "#FFFF00",
            "borderStyle": "5px groove",
            "ranks": "Soviet",
            "names": "Soviet",
            "rangedIn": "https://s3.amazonaws.com/files.d20.io/images/307909232/aEbkdXCShELgc4zcz89srg/thumb.png?1665016513",
            "pinned": "https://s3.amazonaws.com/files.d20.io/images/364582400/VKa2E3Avx1Jd4OKUcuWjxA/thumb.png?1698090348",
            "bailed": "https://s3.amazonaws.com/files.d20.io/images/364582400/VKa2E3Avx1Jd4OKUcuWjxA/thumb.png?1698090348",
            "pinnedCharID": "-NhltPoS8_P4_rslcUsA",
            "barrageimage": "https://s3.amazonaws.com/files.d20.io/images/319032004/qf3aHgIiFnJ0aYoPOFR-TA/thumb.png?1671325647",
            "objectiveimage": "https://s3.amazonaws.com/files.d20.io/images/365313516/Bpy0UrmmYYph7t5xLL0o9A/thumb.png?1698546715",
            "platoonmarkers": ["letters_and_numbers0099::4815235","letters_and_numbers0100::4815236","letters_and_numbers0101::4815237","letters_and_numbers0102::4815238","letters_and_numbers0103::4815239","letters_and_numbers0104::4815240","letters_and_numbers0105::4815241","letters_and_numbers0106::4815242","letters_and_numbers0107::4815243","letters_and_numbers0108::4815244","letters_and_numbers0109::4815245","letters_and_numbers0110::4815246","letters_and_numbers0111::4815247","letters_and_numbers0112::4815248","letters_and_numbers0113::4815249","letters_and_numbers0114::4815250","letters_and_numbers0115::4815251","letters_and_numbers0116::4815252","letters_and_numbers0117::4815253","letters_and_numbers0118::4815254","letters_and_numbers0119::4815255","letters_and_numbers0120::4815256","letters_and_numbers0121::4815257","letters_and_numbers0122::4815258","letters_and_numbers0123::4815259","letters_and_numbers0124::4815260"],
        },
        "West Germany": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/329415788/ypEgv2eFi-BKX3YK6q_uOQ/thumb.png?1677173028",
            "dice": "West-German",
            "backgroundColour": "#000000",
            "titlefont": "Bokor",
            "fontColour": "#FFFFFF",
            "borderColour": "#000000",
            "borderStyle": "5px double",
            "ranks": "German",
            "names": "German",
            "rangedIn": "https://s3.amazonaws.com/files.d20.io/images/307909216/Cqm8z6ZX2WPDQkodhdLVqQ/thumb.png?1665016507",
            "pinned": "https://s3.amazonaws.com/files.d20.io/images/364580773/vg85YjKhl8LBdp-FSbTBtQ/thumb.png?1698089517",
            "bailed": "https://s3.amazonaws.com/files.d20.io/images/364580773/vg85YjKhl8LBdp-FSbTBtQ/thumb.png?1698089517",
            "pinnedCharID": "",
            "barrageimage": "https://s3.amazonaws.com/files.d20.io/images/319029852/xSAh0T5hTSCOSHrRZKBrtA/thumb.png?1671324745",
            "objectiveimage": "",
            "platoonmarkers": ["letters_and_numbers0197::4815333","letters_and_numbers0198::4815334","letters_and_numbers0199::4815335","letters_and_numbers0200::4815336","letters_and_numbers0201::4815337","letters_and_numbers0202::4815338","letters_and_numbers0203::4815339","letters_and_numbers0204::4815340","letters_and_numbers0205::4815341","letters_and_numbers0206::4815342","letters_and_numbers0207::4815343","letters_and_numbers0208::4815344","letters_and_numbers0209::4815345","letters_and_numbers0210::4815346","letters_and_numbers0211::4815347","letters_and_numbers0212::4815348","letters_and_numbers0213::4815349","letters_and_numbers0214::4815350","letters_and_numbers0215::4815351","letters_and_numbers0216::4815352","letters_and_numbers0217::4815353","letters_and_numbers0218::4815354","letters_and_numbers0219::4815355","letters_and_numbers0220::4815356","letters_and_numbers0221::4815357","letters_and_numbers0222::4815358"],
        },
        "British": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/330506939/YtTgDTM3q7p8m0fJ4-E13A/thumb.png?1677713592",
            "backgroundColour": "#0E2A7A",
            "dice": "UK",
            "titlefont": "Merriweather",
            "fontColour": "#FFFFFF",
            "borderColour": "#BC2D2F",
            "borderStyle": "5px groove",
            "ranks": "Western",
            "names": "British",
            "rangedIn": "https://s3.amazonaws.com/files.d20.io/images/328837544/KrWC027rT0Lw_ghCuu_5DQ/thumb.png?1676838067",
            "pinned": "https://s3.amazonaws.com/files.d20.io/images/365311899/aJNi6yvCdnwEINZWsAL63g/thumb.png?1698545921",
            "bailed": "https://s3.amazonaws.com/files.d20.io/images/365311899/aJNi6yvCdnwEINZWsAL63g/thumb.png?1698545921",
            "pinnedCharID": "-NhtBzw_bXWrJORCxWZK",
            "barrageimage": "https://s3.amazonaws.com/files.d20.io/images/327891446/xsAVVJ0Ft-xZW92JUtZBdw/thumb.png?1676321000",
            "objectiveimage": "https://s3.amazonaws.com/files.d20.io/images/365313551/2_miHmMrIheFFKq-5m3Iyw/thumb.png?1698546731",
            "platoonmarkers": ["letters_and_numbers0148::4815284","letters_and_numbers0149::4815285","letters_and_numbers0150::4815286","letters_and_numbers0151::4815287","letters_and_numbers0152::4815288","letters_and_numbers0153::4815289","letters_and_numbers0154::4815290","letters_and_numbers0155::4815291","letters_and_numbers0156::4815292","letters_and_numbers0157::4815293","letters_and_numbers0158::4815294","letters_and_numbers0159::4815295","letters_and_numbers0160::4815296","letters_and_numbers0161::4815297","letters_and_numbers0162::4815298","letters_and_numbers0163::4815299","letters_and_numbers0164::4815300","letters_and_numbers0165::4815301","letters_and_numbers0166::4815302","letters_and_numbers0167::4815303","letters_and_numbers0168::4815304","letters_and_numbers0169::4815305","letters_and_numbers0170::4815306","letters_and_numbers0171::4815307","letters_and_numbers0172::4815308","letters_and_numbers0173::4815309"],
        },
        "US Army": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/327595663/Nwyhbv22KB4_xvwYEbL3PQ/thumb.png?1676165491",
            "backgroundColour": "#FFFFFF",
            "dice": "USA",
            "titlefont": "Arial",
            "fontColour": "#006400",
            "borderColour": "#006400",
            "borderStyle": "5px double",
            "ranks": "Western",
            "names": "USA",
            "rangedIn": "https://s3.amazonaws.com/files.d20.io/images/328835139/zd6jnMDVIEEvRg_cNkHxeQ/thumb.png?1676837399",
            "pinned": "https://s3.amazonaws.com/files.d20.io/images/365311909/Gu6sVBnrKauP0gibski5CQ/thumb.png?1698545925",
            "bailed": "https://s3.amazonaws.com/files.d20.io/images/365311909/Gu6sVBnrKauP0gibski5CQ/thumb.png?1698545925",
            "pinnedCharID": "-NhtC--h2t90ayjtfXPx",
            "barrageimage": "https://s3.amazonaws.com/files.d20.io/images/327891469/QfaYQvRbVs7tA_3jGFwQ9Q/thumb.png?1676321007",
            "objectiveimage": "https://s3.amazonaws.com/files.d20.io/images/365313723/o7CvHeJhHOVJ9h2tUECKfQ/thumb.png?1698546825",
            "platoonmarkers": ["letters_and_numbers0050::4815186","letters_and_numbers0051::4815187","letters_and_numbers0052::4815188","letters_and_numbers0053::4815189","letters_and_numbers0054::4815190","letters_and_numbers0055::4815191","letters_and_numbers0056::4815192","letters_and_numbers0057::4815193","letters_and_numbers0058::4815194","letters_and_numbers0059::4815195","letters_and_numbers0060::4815196","letters_and_numbers0061::4815197","letters_and_numbers0062::4815198","letters_and_numbers0063::4815199","letters_and_numbers0064::4815200","letters_and_numbers0065::4815201","letters_and_numbers0066::4815202","letters_and_numbers0067::4815203","letters_and_numbers0068::4815204","letters_and_numbers0069::4815205","letters_and_numbers0070::4815206","letters_and_numbers0071::4815207","letters_and_numbers0072::4815208","letters_and_numbers0073::4815209","letters_and_numbers0074::4815210","letters_and_numbers0075::4815211"],
        },
        "US Marine Corps": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/327769203/uM2mlqoLnxDD_ptnBdNXfg/thumb.png?1676240966",
            "dice": "USMC",
            "backgroundColour": "#FFFFFF",
            "titlefont": "Arial",
            "fontColour": "#00008B",
            "borderColour": "#00008B",
            "borderStyle": "5px double",
            "ranks": "Western",
            "names": "USA",
            "rangedIn": "https://s3.amazonaws.com/files.d20.io/images/328835177/sjCggEYtL2PfE32fyQV4zw/thumb.png?1676837406",
            "platoonmarkers": ["","letters_and_numbers0148::4815284","letters_and_numbers0149::4815285","letters_and_numbers0150::4815286","letters_and_numbers0151::4815287","letters_and_numbers0152::4815288","letters_and_numbers0153::4815289","letters_and_numbers0154::4815290","letters_and_numbers0155::4815291","letters_and_numbers0156::4815292","letters_and_numbers0157::4815293","letters_and_numbers0158::4815294","letters_and_numbers0159::4815295","letters_and_numbers0160::4815296","letters_and_numbers0161::4815297","letters_and_numbers0162::4815298","letters_and_numbers0163::4815299","letters_and_numbers0164::4815300","letters_and_numbers0165::4815301","letters_and_numbers0166::4815302","letters_and_numbers0167::4815303","letters_and_numbers0168::4815304","letters_and_numbers0169::4815305","letters_and_numbers0170::4815306","letters_and_numbers0171::4815307","letters_and_numbers0172::4815308","letters_and_numbers0173::4815309"],
            "barrageimage": "https://s3.amazonaws.com/files.d20.io/images/327891469/QfaYQvRbVs7tA_3jGFwQ9Q/thumb.png?1676321007",
        },

        "Neutral": {
            "image": "",
            "backgroundColour": "#FFFFFF",
            "dice": "UK",
            "titlefont": "Arial",
            "fontColour": "#000000",
            "borderColour": "#00FF00",
            "borderStyle": "5px ridge",
            "objectiveimage": "https://s3.amazonaws.com/files.d20.io/images/312111244/vPCrjmQ7ep4nvKWu8LOmFQ/thumb.png?1667256328",
        },
        "Warsaw Pact": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/341399561/LeCkvkoO5ea8g2bgODSoog/thumb.webp?1683859633",
            "dice": "Soviet",
            "backgroundColour": "#FFFF00",
            "titlefont": "Anton",
            "fontColour": "#000000",
            "borderColour": "#FF0000",
            "borderStyle": "5px ridge",
            "rangedIn": "https://s3.amazonaws.com/files.d20.io/images/307909232/aEbkdXCShELgc4zcz89srg/thumb.png?1665016513",
            "platoonmarkers": ["","letters_and_numbers0099::4815235","letters_and_numbers0100::4815236","letters_and_numbers0101::4815237","letters_and_numbers0102::4815238","letters_and_numbers0103::4815239","letters_and_numbers0104::4815240","letters_and_numbers0105::4815241","letters_and_numbers0106::4815242","letters_and_numbers0107::4815243","letters_and_numbers0108::4815244","letters_and_numbers0109::4815245","letters_and_numbers0110::4815246","letters_and_numbers0111::4815247","letters_and_numbers0112::4815248","letters_and_numbers0113::4815249","letters_and_numbers0114::4815250","letters_and_numbers0115::4815251","letters_and_numbers0116::4815252","letters_and_numbers0117::4815253","letters_and_numbers0118::4815254","letters_and_numbers0119::4815255","letters_and_numbers0120::4815256","letters_and_numbers0121::4815257","letters_and_numbers0122::4815258","letters_and_numbers0123::4815259","letters_and_numbers0124::4815260"],
        },
        "NATO": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/341399549/70dmI15RviYyvp1MxHkf4A/thumb.webp?1683859627",
            "backgroundColour": "#0A2065",
            "dice": "British",
            "titlefont": "Merriweather",
            "fontColour": "#FFFFFF",
            "borderColour": "#BC2D2F",
            "borderStyle": "5px groove",
            "rangedIn": "https://s3.amazonaws.com/files.d20.io/images/328837544/KrWC027rT0Lw_ghCuu_5DQ/thumb.png?1676838067",
            "platoonmarkers": ["","letters_and_numbers0148::4815284","letters_and_numbers0149::4815285","letters_and_numbers0150::4815286","letters_and_numbers0151::4815287","letters_and_numbers0152::4815288","letters_and_numbers0153::4815289","letters_and_numbers0154::4815290","letters_and_numbers0155::4815291","letters_and_numbers0156::4815292","letters_and_numbers0157::4815293","letters_and_numbers0158::4815294","letters_and_numbers0159::4815295","letters_and_numbers0160::4815296","letters_and_numbers0161::4815297","letters_and_numbers0162::4815298","letters_and_numbers0163::4815299","letters_and_numbers0164::4815300","letters_and_numbers0165::4815301","letters_and_numbers0166::4815302","letters_and_numbers0167::4815303","letters_and_numbers0168::4815304","letters_and_numbers0169::4815305","letters_and_numbers0170::4815306","letters_and_numbers0171::4815307","letters_and_numbers0172::4815308","letters_and_numbers0173::4815309"],
        },
        "Canada": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/341315251/n0tyjwJROMhYYaJhteCF_Q/thumb.png?1683817346",
            "backgroundColour": "#FFFFFF",
            "titlefont": "Arial",
            "fontColour": "#000000",
            "borderColour": "#EA3423",
            "borderStyle": "5px groove",
            "ranks": "Western",
            "names": "British",
            "barrageimage": "https://s3.amazonaws.com/files.d20.io/images/340585556/aqSICgjEkrT9sLf730UJIA/thumb.png?1683384058",
        },
        "Poland": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/341315137/Y92DdqCPCBvk4hcmPk6fRw/thumb.png?1683817256",
            "backgroundColour": "#CA3742",
            "titlefont": "Arial",
            "fontColour": "#FFFFFF",
            "borderColour": "#FFFFFF",
            "borderStyle": "5px groove",
            "ranks": "Soviet",
            "names": "Soviet",
            "barrageimage": "https://s3.amazonaws.com/files.d20.io/images/319032004/qf3aHgIiFnJ0aYoPOFR-TA/thumb.png?1671325647",
        },
        "Israel": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/366072697/aGu0UIeI_9CN1Uk-ti_bbQ/thumb.png?1699035971",
            "dice": "Israel",
            "backgroundColour": "#0068b1",
            "titlefont": "Arial",
            "fontColour": "#FFFFFF",
            "borderColour": "#0068b1",
            "borderStyle": "5px double",
            "ranks": "Western",
            "names": "Israel",
            "rangedIn": "https://s3.amazonaws.com/files.d20.io/images/365910297/BxbRCFdLS1KrSemBhPXWKw/thumb.png?1698940486",
            "pinned": "https://s3.amazonaws.com/files.d20.io/images/365910077/5T9JPuKR1O5Kd9wlXqsfpQ/thumb.png?1698940338",
            "bailed": "https://s3.amazonaws.com/files.d20.io/images/365910072/lx9C4uLHSh7XnCrzdJWPHg/thumb.png?1698940336",
            "pinnedCharID": "",
            "barrageimage": "https://s3.amazonaws.com/files.d20.io/images/327891446/xsAVVJ0Ft-xZW92JUtZBdw/thumb.png?1676321000",
            "platoonmarkers": ["letters_and_numbers0148::4815284","letters_and_numbers0149::4815285","letters_and_numbers0150::4815286","letters_and_numbers0151::4815287","letters_and_numbers0152::4815288","letters_and_numbers0153::4815289","letters_and_numbers0154::4815290","letters_and_numbers0155::4815291","letters_and_numbers0156::4815292","letters_and_numbers0157::4815293","letters_and_numbers0158::4815294","letters_and_numbers0159::4815295","letters_and_numbers0160::4815296","letters_and_numbers0161::4815297","letters_and_numbers0162::4815298","letters_and_numbers0163::4815299","letters_and_numbers0164::4815300","letters_and_numbers0165::4815301","letters_and_numbers0166::4815302","letters_and_numbers0167::4815303","letters_and_numbers0168::4815304","letters_and_numbers0169::4815305","letters_and_numbers0170::4815306","letters_and_numbers0171::4815307","letters_and_numbers0172::4815308","letters_and_numbers0173::4815309"],
        },
        "Syria": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/366073450/MaE7Hz3ruNZ-2LrDfZQicA/thumb.png?1699036295",
            "dice": "Syria",
            "backgroundColour": "#2f8f43",
            "titlefont": "Rye",
            "fontColour": "#FFFFFF",
            "borderColour": "#2f8f43",
            "borderStyle": "5px solid",
            "ranks": "Arabic",
            "names": "Arabic",
            "rangedIn": "https://s3.amazonaws.com/files.d20.io/images/307909232/aEbkdXCShELgc4zcz89srg/thumb.png?1665016513",
            "pinned": "https://s3.amazonaws.com/files.d20.io/images/365910088/V1IH9ElaoOQANm96ChVnRw/thumb.png?1698940344",
            "bailed": "https://s3.amazonaws.com/files.d20.io/images/365910087/WnjytMMCK-NJROZviRF6YA/thumb.png?1698940344",
            "pinnedCharID": "",
            "barrageimage": "https://s3.amazonaws.com/files.d20.io/images/319032004/qf3aHgIiFnJ0aYoPOFR-TA/thumb.png?1671325647",
            "platoonmarkers": ["letters_and_numbers0197::4815333","letters_and_numbers0198::4815334","letters_and_numbers0199::4815335","letters_and_numbers0200::4815336","letters_and_numbers0201::4815337","letters_and_numbers0202::4815338","letters_and_numbers0203::4815339","letters_and_numbers0204::4815340","letters_and_numbers0205::4815341","letters_and_numbers0206::4815342","letters_and_numbers0207::4815343","letters_and_numbers0208::4815344","letters_and_numbers0209::4815345","letters_and_numbers0210::4815346","letters_and_numbers0211::4815347","letters_and_numbers0212::4815348","letters_and_numbers0213::4815349","letters_and_numbers0214::4815350","letters_and_numbers0215::4815351","letters_and_numbers0216::4815352","letters_and_numbers0217::4815353","letters_and_numbers0218::4815354","letters_and_numbers0219::4815355","letters_and_numbers0220::4815356","letters_and_numbers0221::4815357","letters_and_numbers0222::4815358"],
        },







    }

    //Hex Info
    const xSpacing = 75.1985619844599;
    const ySpacing = 66.9658278242677;

    const HexInfo = {
        size: {
            x: xSpacing/Math.sqrt(3),
            y: ySpacing * 2/3,
        },
        pixelStart: {
            x: xSpacing/2,
            y: 43.8658278242683,
        },
        halfX: xSpacing/2,
        width: xSpacing,
        height: 89.2877704323569,
        directions: {},
    };

    const M = {
            f0: Math.sqrt(3),
            f1: Math.sqrt(3)/2,
            f2: 0,
            f3: 3/2,
            b0: Math.sqrt(3)/3,
            b1: -1/3,
            b2: 0,
            b3: 2/3,
    };

    class Point {
        constructor(x,y) {
            this.x = x;
            this.y = y;
        }
    };

    class Hex {
        constructor(q,r,s) {
            this.q = q;
            this.r =r;
            this.s = s;
        }

        add(b) {
            return new Hex(this.q + b.q, this.r + b.r, this.s + b.s);
        }
        subtract(b) {
            return new Hex(this.q - b.q, this.r - b.r, this.s - b.s);
        }
        static direction(direction) {
            return HexInfo.directions[direction];
        }
        neighbour(direction) {
            //returns a hex (with q,r,s) for neighbour, specify direction eg. hex.neighbour("NE")
            return this.add(HexInfo.directions[direction]);
        }
        neighbours() {
            //all 6 neighbours
            let results = [];
            for (let i=0;i<DIRECTIONS.length;i++) {
                results.push(this.neighbour(DIRECTIONS[i]));
            }
            return results;
        }

        len() {
            return (Math.abs(this.q) + Math.abs(this.r) + Math.abs(this.s)) / 2;
        }
        distance(b) {
            return this.subtract(b).len();
        }
        round() {
            var qi = Math.round(this.q);
            var ri = Math.round(this.r);
            var si = Math.round(this.s);
            var q_diff = Math.abs(qi - this.q);
            var r_diff = Math.abs(ri - this.r);
            var s_diff = Math.abs(si - this.s);
            if (q_diff > r_diff && q_diff > s_diff) {
                qi = -ri - si;
            }
            else if (r_diff > s_diff) {
                ri = -qi - si;
            }
            else {
                si = -qi - ri;
            }
            return new Hex(qi, ri, si);
        }
        lerp(b, t) {
            return new Hex(this.q * (1.0 - t) + b.q * t, this.r * (1.0 - t) + b.r * t, this.s * (1.0 - t) + b.s * t);
        }
        linedraw(b) {
            //returns array of hexes between this hex and hex 'b'
            var N = this.distance(b);
            var a_nudge = new Hex(this.q + 1e-06, this.r + 1e-06, this.s - 2e-06);
            var b_nudge = new Hex(b.q + 1e-06, b.r + 1e-06, b.s - 2e-06);
            var results = [];
            var step = 1.0 / Math.max(N, 1);
            for (var i = 0; i <= N; i++) {
                results.push(a_nudge.lerp(b_nudge, step * i).round());
            }
            return results;
        }
        label() {
            //translate hex qrs to Roll20 map label
            let doubled = DoubledCoord.fromCube(this);
            let label = rowLabels[doubled.row] + (doubled.col + 1).toString();
            return label;
        }

        radius(rad) {
            //returns array of hexes in radius rad
            //Not only is x + y + z = 0, but the absolute values of x, y and z are equal to twice the radius of the ring
            let results = [];
            let h;
            for (let i = 0;i <= rad; i++) {
                for (let j=-i;j<=i;j++) {
                    for (let k=-i;k<=i;k++) {
                        for (let l=-i;l<=i;l++) {
                            if((Math.abs(j) + Math.abs(k) + Math.abs(l) === i*2) && (j + k + l === 0)) {
                                h = new Hex(j,k,l);
                                results.push(this.add(h));
                            }
                        }
                    }
                }
            }
            return results;
        }
        angle(b) {
            //angle between 2 hexes
            let origin = hexToPoint(this);
            let destination = hexToPoint(b);

            let x = Math.round(origin.x - destination.x);
            let y = Math.round(origin.y - destination.y);
            let phi = Math.atan2(y,x);
            phi = phi * (180/Math.PI);
            phi = Math.round(phi);
            phi -= 90;
            phi = Angle(phi);
            return phi;
        }        
    };

    class DoubledCoord {
        constructor(col, row) {
            this.col = col;
            this.row = row;
        }
        static fromCube(h) {
            var col = 2 * h.q + h.r;
            var row = h.r;
            return new DoubledCoord(col, row);//note will need to use rowLabels for the row, and add one to column to translate from 0
        }
        toCube() {
            var q = (this.col - this.row) / 2; //as r = row
            var r = this.row;
            var s = -q - r;
            return new Hex(q, r, s);
        }
    };

    const pointToHex = (point) => {
        let x = (point.x - HexInfo.pixelStart.x)/HexInfo.size.x;
        let y = (point.y - HexInfo.pixelStart.y)/HexInfo.size.y;
        let q = M.b0 * x + M.b1 * y;
        let r = M.b2 * x + M.b3 * y;
        let s = -q-r;
        let hex = new Hex(q,r,s);
        hex = hex.round();
        return hex;
    }

    const hexToPoint = (hex) => {
        let q = hex.q;
        let r = hex.r;
        let x = (M.f0 * q + M.f1 * r) * HexInfo.size.x;
        x += HexInfo.pixelStart.x;
        let y = (M.f2 * r + M.f3 * r) * HexInfo.size.y;
        y += HexInfo.pixelStart.y;
        let point = new Point(x,y);
        return point;
    }

    //core classes
    class Formation {
        constructor(nation,id,name){
            if (!id) {
                id = stringGen();
            }
            this.id = id;
            this.name = name;
            this.nation = nation;
            this.player = (WarsawPact.includes(nation)) ? 0:1;
            this.unitIDs = [];

            if (!state.TY.formations[id]) {
                state.TY.formations[id] = name;
            }
            FormationArray[id] = this;
        }

        add(unit) {
            if (this.unitIDs.includes(unit.id) === false) {
                this.unitIDs.push(unit.id);
                unit.formationID = this.id;
            }
        }

        remove(unit) {
            let unitIDs = this.unitIDs;
            let index = unitIDs.indexOf(unit.id);
            if (index > -1) {
                unitIDs.splice(index,1);
            }
            this.unitIDs = unitIDs;
            if (unitIDs.length === 0 && this.name !== "Support") {
                delete state.TY.formations[this.id]
                SetupCard("Formation Destroyed","",this.nation);
                PrintCard();
            }
        }
    }

    class Unit {
        constructor(nation,id,name,formationID){
            if (!id) {
                id = stringGen();
            }
            this.id = id;
            this.name = name;
            this.order = "";
            this.specialorder = "";
            this.nation = nation;
            this.player = (WarsawPact.includes(nation)) ? 0:1;
            this.formationID = formationID;
            this.number = 0;
            this.teamIDs = [];
            this.hqUnit = false;
            this.artillery = false;
            this.type = "";
            this.num = 0;
            this.linkedUnitID = ""; //used in Mistaken for HQ units
            this.limited = 0; //used to track limited use weapons
            this.inReserve = false;
            this.size; //used for pinning purposes, size of unit at start of turn

            if (!state.TY.units[id]) {
                state.TY.units[id] = name;
            }

            UnitArray[id] = this;
        }

        add(team) {
            if (this.teamIDs.includes(team.id) === false) {
                if (team.token.get("status_black-flag") === true) {
                    this.teamIDs.unshift(team.id);
                } else {
                    this.teamIDs.push(team.id);
                }
                team.unitID = this.id;
                if (team.special.includes("HQ") || team.token.get(SM.HQ)) {
                    this.hqUnit = true;
                }
                if (team.artillery === true) {
                    this.artillery = true;
                }
                if (team.special.includes("Passengers") === false || (team.special.includes("Passengers") === true && this.hqUnit === false)) {
                    this.type = team.type;
                } 
                this.size += parseInt(team.token.get("bar1_value")) || 1;
            }
        }

        remove(team) {
            let teamIDs = this.teamIDs;
            let index = teamIDs.indexOf(team.id);
            log("In Unit.remove")
            log("Index of Team ID: " + index)
            if (index > -1) {
                teamIDs.splice(index,1);
                if (teamIDs.length === 1 && this.hqUnit === true) {
                    let team = TeamArray[teamIDs[0]];
                    if (team.special.includes("Transport")) {
                        sendChat("","Remaining Team is Transport and Leaves the Field");
                        team.flees();
                    }
                }
            }
            this.teamIDs = teamIDs;
     
            if (teamIDs.length === 0) {
                let formation = FormationArray[this.formationID];
                formation.remove(this);
                if (this.hqUnit === true) {
                    deadHQs[this.player].push(formation.id);
                }
                delete state.TY.units[this.id];
                delete UnitArray[this.id];
            } else if (index === 0) {
                let auraC = team.token.get("aura1_color");
                //change name to Sergeant if isnt a Lt or higher
                //pick most central team
                let newLeader = CentreTeam(this);
                let old_index = this.teamIDs.indexOf(newLeader.id);
                this.teamIDs.splice(0, 0, this.teamIDs.splice(old_index, 1)[0]);
                if (!auraC || auraC === "transparent") {
                    auraC = (this.order === "") ? Colours.green:Colours.black;
                };
                newLeader.name = PromotedName(newLeader,team);
                newLeader.token.set({
                    name: newLeader.name,
                    aura1_color: auraC,
                    tint_color: "transparent",
                })
                newLeader.inCommand = true;
            } 
        }

        unpin() {
            let leaderTeam = TeamArray[this.teamIDs[0]];
            leaderTeam.token.set("aura1_color",Colours.green);
            leaderTeam.removeCondition("Pinned");
        }

        pin() {
            let leaderTeam = TeamArray[this.teamIDs[0]];
            leaderTeam.token.set("aura1_color",Colours.yellow);
            leaderTeam.addCondition("Pinned");
        }

        pinned() {
            let result = false;
            let leaderTeam = TeamArray[this.teamIDs[0]];
            if (state.TY.conditions[leaderTeam.id]) {
                if (state.TY.conditions[leaderTeam.id]["Pinned"]) {
                    result = true;
                }
            }
            return result;
        }

        resetflags() {
log(this.name + " in resetflags()")
            let newTeamIDs = [];
            let conditions = ["Dash","Tactical","Hold","Assault","Fired","AAFire","Spot"];

            for (let i=0;i<this.teamIDs.length;i++) {
                let id = this.teamIDs[i];
                let team = TeamArray[id];
                if (!team) {
                    if (state.TY.teams[id]) {
                        delete state.TY.teams[id];
                    }
                    continue
                };
                newTeamIDs.push(id);
            }
            this.teamIDs = newTeamIDs;
            //this.IC(); ? done after movement
            this.Size();
log("Size: " + this.size)
            this.order = "";
            this.specialorder = "";

            if (this.teamIDs.length > 0) {
                let unitLeader = TeamArray[this.teamIDs[0]];
                if (unitLeader) {
                    unitLeader.token.set("bar3_value",0);
                    if (unitLeader.bailed === true) {
                        SwapLeader(this);
                    }
                }
                for (let i=0;i<this.teamIDs.length;i++) {
                    let team = TeamArray[this.teamIDs[i]];
log(team.name + " inCommand: " + team.inCommand)
                    if (state.TY.conditions[team.id]) {
                        for (let c=0;c<conditions.length;c++) {
                            if (state.TY.conditions[team.id][conditions[c]]) {
                                team.removeCondition(conditions[c]);
                            }
                        }
                    }
                    team.spotAttempts = 0;
                    team.prevHexLabel = team.hexLabel;
                    team.prevHex = team.hex;
                    team.order = "";
                    team.specialorder = "";
                    team.hitArray = [];
                    team.eta = [];
                    team.moved = false;
                    team.maxTact = false;
                    team.fired = false;
                    team.aaFired = false;
                    if (i===0) {
                        team.token.set("aura1_color",Colours.green);
                    } else {
                        if (team.inCommand === true) {
                            team.token.set("aura1_color","transparent")
                        } else {
                            team.token.set("aura1_color",Colours.lightblue)
                        }
                    }
                }
            } 
        }

        IC() {
            if (this.type === "System Unit") {return};
            let commandRadius = (this.size > 7 || this.type === "Aircraft" || this.type === "Helicopter") ? 8:6;
            let unitLeader = TeamArray[this.teamIDs[0]];
            for (let j=0;j<this.teamIDs.length;j++) {
                let team = TeamArray[this.teamIDs[j]];
                if (!team) {continue};
                let dist = team.hex.distance(unitLeader.hex);
                let ic = true;
                if (dist > commandRadius && team.special.includes("HQ") === false && team.special.includes("Independent") === false) {
                    ic = false
                } 
                team.IC(ic);
            }
        }

        Size() {
            let size = 0;
            _.forEach(this.teamIDs,id => {
                let team = TeamArray[id];
                let number = parseInt(team.token.get("bar1_value")) || 1;
                size += number;
            })
            this.size = size;
        }



    }

    class Team {
        constructor(tokenID,formationID,unitID) {
            let token = findObjs({_type:"graphic", id: tokenID})[0];
            if (!token) {sendChat("","No Token?"); return}
            let char = getObj("character", token.get("represents")); 
            if (!char) {sendChat("","No Character?"); return}
            let charName = char.get("name");

            let attributeArray = AttributeArray(char.id);
            let nation = attributeArray.nation;
            let player = (WarsawPact.includes(nation)) ? 0:1;
            if (nation === "Neutral") {player = 2};

            let type = attributeArray.type;
            let location = new Point(token.get("left"),token.get("top"));
            let hex = pointToHex(location);
            let hexLabel = hex.label();
            let infoArray = [];

            let starthp = parseInt(attributeArray.startnumber) || 1;

            //create array of weapon info
            let weaponArray = [];
            let atWeapons = [];
            let artilleryWpn;
            let artilleryTeam = false;

            for (let i=1;i<5;i++) {
                let art = false;
                let name = attributeArray["weapon"+i+"name"];
                if (!name || name == " " || name == "") {continue};
                if (name.includes("(") || name.includes(")")) {
                    name = name.replace("(","[");
                    name = name.replace(")","]");
                    AttributeSet(char.id,"weapon"+i+"name",name);
                }
                let fp = attributeArray["weapon"+i+"fp"];
                if (fp === "AUTO") {
                    fp = 1;
                } else {
                    fp = Number(attributeArray["weapon"+i+"fp"].replace(/[^\d]/g, ""));
                }
                let notes = attributeArray["weapon"+i+"notes"];
                if (!notes || notes === "") {notes = " "};

                let halted = attributeArray["weapon"+i+"halted"];
                let moving = attributeArray["weapon"+i+"moving"];

                if (halted !== "Artillery" && halted !== "Salvo") {
                    halted = parseInt(halted) || 0;
                }

                if (moving !== "Artillery" && moving !== "Salvo") {
                    moving = parseInt(moving) || 0;
                }

                let rangeText = attributeArray["weapon"+i+"range"];
                rangeText = rangeText.split("-");
                let minRange = 0;
                let maxRange = rangeText[0].replace(/[^\d]/g, "");
                if (rangeText.length > 1) {
                    minRange = rangeText[0].replace(/[^\d]/g, "");
                    maxRange = rangeText[1].replace(/[^\d]/g, "");
                }
                minRange = parseInt(minRange) || 0;
                maxRange = parseInt(maxRange) || 1;
                let type = attributeArray["weapon"+i+"type"];
                if (!type || type === "") {
                    type = "Small Arms";
                }
                let at = parseInt(attributeArray["weapon"+i+"at"]) || 0;

                let weapon = {
                    name: name,
                    minRange: minRange,
                    maxRange: maxRange,
                    halted: halted,
                    moving: moving,
                    at: at,
                    fp: fp,
                    notes: notes,
                    type: type,
                }

                if (notes !== " ") {
                    //puts info on weapon specials on sheet
                    let ws = notes.split(",");
                    for (let s=0;s<ws.length;s++) {
                        let wss = ws[s].trim();
                        infoArray.push(wss);
                    }
                }

                if (weapon.halted === "Artillery" || weapon.halted === "Salvo" || weapon.moving === "Artillery" || weapon.moving === "Salvo") {
                    artilleryWpn = weapon;
                    art = true;
                    artilleryTeam = true;
                };

                if (at > 0 && art === false && minRange <= 1) {
                    for (let a=0;a<weapon.halted;a++) {
                        atWeapons.push(weapon);
                    }
                }

                weaponArray.push(weapon);
                
            }

            atWeapons.sort(function (a,b) {
                if (a.at > b.at) {return -1};
                if (a.at < b.at) {return 1};
                if (a.at === b.at && a.fp > b.fp) {return -1};
                if (a.at === b.at && a.fp < b.fp) {return 1};
                return 0;
            });

            atWeapons.length = starthp;
            //update sheet with info
            let specials = attributeArray.special || " "
log("Specials: " + specials)
            let specialText = "";


            specials = specials.split(",");
            for (let i=0;i<specials.length;i++) {
                let special = specials[i].trim();
                if (special === "") {continue};
                if (i>0) {
                    specialText += ' • ';
                }
                specialText += special;
                infoArray.push(special);
            }

            infoArray = [...new Set(infoArray)];

            infoArray.sort(function (a,b) {
                let a1 = a.charAt(0).toLowerCase();
                let b1 = b.charAt(0).toLowerCase();
                if (a1<b1) {return -1};
                if (a1>b1) {return 1};
                return 0;
            });
log(infoArray)
            for (let i=0;i<10;i++) {
                let specName = infoArray[i];
                if (!specName || specName === "") {continue}
                if (specName.includes("Infra")) {
                    specName = "Infra-Red";
                }
                if (specName.includes("(")) {
                    let index = specName.indexOf("(");
                    specName = specName.substring(0,index);
                    specName += "(X)";
                }
                if (specName.includes("+")) {
                    let index = specName.indexOf("+");
                    specName = specName.substring(0,index);
                    specName += "+X";
                }
                let specInfo = specialInfo[specName];
                if (specName) {
                    specName += ": ";
                }
                if (!specInfo && specName) {
                    specInfo = "Not in Database Yet";
                }
                let atName = "spec" + (i+1) + "Name";
                let atText = "spec" + (i+1) + "Text";

                if (!specName) {
                    DeleteAttribute(char.id,atName);
                } else {
                    AttributeSet(char.id,atName,specName);
                    AttributeSet(char.id,atText,specInfo);
                }
            }

            let special = infoArray.toString() || " "
log("Special: " + special)
log("Special Text: " + specialText)
            if (specialText === "") {
                DeleteAttribute(char.id,"specialText");
            } else {
                AttributeSet(char.id,"specialText",specialText);
            }

            let rank = parseInt(attributeArray.rank) || 0;

            //armour
            let front = parseInt(attributeArray.armourF);
            let side = parseInt(attributeArray.armourS) || 0;
            let top = parseInt(attributeArray.armourT) || 0;

            //passengers
            let maxPass = 0;
            if (special.includes("Passengers")) {
                let s = special.split(",");
                for (let a=0;a<s.length;a++) {
                    let sub = s[a];
                    if (sub.includes("Passengers")) {
                        maxPass = sub.replace(/[^\d]/g,"");
                        break;
                    }
                }
            }

            let uat = (special.includes("Passengers") && (weaponArray.length === 0 || type === "Unarmoured Tank")) ? true:false;

            this.id = tokenID;
            this.token = token;
            this.name = token.get("name");
            this.player = player;
            this.nation = nation;
            this.characterName = charName;
            this.characterID = char.id;
            this.unitID = unitID;
            this.formationID = formationID;

            this.type = type;    
            this.location = location;
            this.prevHexLabel = hexLabel;
            this.prevHex = hex;
            this.starthp = starthp;

            this.order = "";
            this.specialorder = "";
            this.inCommand = true;

            this.tactical = parseInt(attributeArray.tactical);
            this.terraindash = parseInt(attributeArray.terrain);
            this.countrydash = parseInt(attributeArray.country);
            this.roaddash = parseInt(attributeArray.road);
            this.cross = crossStat(attributeArray.cross);

            this.airmove = parseInt(attributeArray.airmove) || "Unlimited";

            this.armourF = front;
            this.armourS = side;
            this.armourT = top;

            this.courage = parseStat(attributeArray.courage);
            this.remount = parseStat(attributeArray.remount);
            this.morale = parseStat(attributeArray.morale);
            this.skill = parseStat(attributeArray.skill);
            this.assault = parseStat(attributeArray.assault);
            this.counterattack = parseStat(attributeArray.counterattack);
            this.hit = parseStat(attributeArray.hit);

            this.artillery = artilleryTeam;
            this.artilleryWpn = artilleryWpn;
            this.spotAttempts = 0;
            this.rangedInHex = {};

            this.hex = hex; //axial
            this.hexLabel = hexLabel; //doubled
            this.rotation = token.get("rotation");
            this.special = special;
            this.rank = rank;

            this.weaponArray = weaponArray;
            this.assaultWpns = atWeapons;
            this.hitArray = [];
            this.eta = [];
            this.shooterIDs = [];
            this.priority = 0;

            this.bailed = this.queryCondition("Bailed Out");
            this.fired = this.queryCondition("Fired");
            this.aaFired = this.queryCondition("AA Fire");
            this.moved = ((this.queryCondition("Tactical") || this.queryCondition("Dash")) === true) ? true:false;
            this.gonetoground = this.queryCondition("GTG");

            this.maxPass = maxPass;
            this.passenger = false;
            this.unarmouredTransport = uat;

            if (!state.TY.teams[this.id]) {
                state.TY.teams[this.id] = {
                    unitID: unitID,
                    formationID: formationID,
                }
            }

            TeamArray[tokenID] = this;
            hexMap[hexLabel].teamIDs.push(tokenID);
        }

        addCondition(condition) {
            let imgSrc,charID;
            let size = 70;
            switch (condition) {
                case 'Bailed Out':
                    imgSrc = Nations[this.nation].bailed;
                    charID = "-Nht9LnFvLCRVCbmcCZd";
                    break;
                case 'Pinned':
                    imgSrc = Nations[this.nation].pinned;
                    charID = "-Nht9LnFvLCRVCbmcCZd";
                    break;
                case 'Dash':
                    imgSrc = "https://s3.amazonaws.com/files.d20.io/images/367732138/K6sIzwifj9tIXcgYPIaw6g/thumb.png?1700012748";
                    charID = "-NhnnimsL_fUE_I44tij";
                    break;
                case 'Tactical':
                    imgSrc = "https://s3.amazonaws.com/files.d20.io/images/367732123/yi-DF0tNtuUCiFf5qQJGsw/thumb.png?1700012741";
                    charID = "-Nhno-si_pOx9WcyqX8Q";
                    break;
                case 'Hold':
                    imgSrc = "https://s3.amazonaws.com/files.d20.io/images/367733007/GPUaJjq4Y3VkbNAjypBGkg/thumb.png?1700013183";
                    charID = "-Nhno4KrMYcgi0c6_keC";
                    break;
                case 'Assault':
                    imgSrc = "https://s3.amazonaws.com/files.d20.io/images/364740790/-PpYtjvGninT5CBZ9cgvcw/thumb.png?1698193663";
                    charID = "-Nhno9pRPTXGOICorXWV";
                    break;
                case 'AAFire':
                    imgSrc =  "https://s3.amazonaws.com/files.d20.io/images/364738389/jQaMAvsc3yfx7tsgMpkZ-Q/thumb.png?1698192640";
                    charID = "-NhnoEpVGQnaSECosUQs";
                    break;
                case 'Fired':
                    imgSrc = "https://s3.amazonaws.com/files.d20.io/images/364738390/jRn7kK1dz3EnFwy8lFzyJw/thumb.png?1698192640";
                    charID = "-NhnoJcnvMESfrIA4ipF";
                    break;
                case 'GTG':
                    imgSrc = "https://s3.amazonaws.com/files.d20.io/images/364740777/TkNdbvE_My02jE0bkz1KzA/thumb.png?1698193655";
                    charID = "-NhnoOo2ydvrjTOFGMXW";
                    break;
                case 'Spot':
                    imgSrc = "https://s3.amazonaws.com/files.d20.io/images/364839305/-UanVemZgRrwTu3fVijGwA/thumb.png?1698268901";
                    charID = "-NhnoS6WDdovvJrkTeHC";
                    break;
                case 'Passengers':
                    imgSrc = "https://s3.amazonaws.com/files.d20.io/images/365230932/HxeMNYtOiyWDnoyvoa8FCQ/thumb.png?1698516760";
                    charID = "-NhrUN0XxRco5XKwLdSM";
                    size = 40;
                    break;
                case 'Land/Take Off':
                    imgSrc = "https://s3.amazonaws.com/files.d20.io/images/366077088/FP0gaU13t5SB11Cq4Fq4zQ/thumb.png?1699037802";
                    charID = "-NiLY-VogcGd_EbrZegV";
                    break;
                case 'Flare':
                    imgSrc = "https://s3.amazonaws.com/files.d20.io/images/366077896/UYxOO1P7P1wBDD75gtpsFA/thumb.png?1699038152";
                    charID = "-NiLYVaQvQOHD16lukjv";
                    break;
            }

            let leftConditions = ["Tactical","Dash","Hold","Assault"];
            let rightConditions = ["Fired","AAFire","GTG","Land/Take Off"];
            let topConditions = ["Flare"];
            let array = [];
            if (leftConditions.includes(condition)) {
                array = leftConditions;
            } else if (rightConditions.includes(condition)) {
                array = rightConditions;
            } else if (topConditions.includes(condition)) {
                array = topConditions;
            }
            //clear other conditions in that array
            if (state.TY.conditions[this.id]) {
                for (let a=0;a<array.length;a++) {
                    if (state.TY.conditions[this.id][array[a]]) {
                        this.removeCondition(array[a]);
                    }
                }
            } else {
                state.TY.conditions[this.id] = {};
            }

            let conditionToken = createObj("graphic", {   
                left: this.location.x,
                top: this.location.y,
                width: size, 
                height: size,
                isdrawing: true,
                pageid: this.token.get("pageid"),
                imgsrc: imgSrc,
                layer: "gmlayer",
                represents: charID,
            });
            toFront(conditionToken);
            TokenCondition.AttachConditionToToken(conditionToken.id,this.id);
            state.TY.conditions[this.id][condition] = conditionToken.id;
        }

        removeCondition(condition) {
            if (state.TY.conditions[this.id]) {
                let conditions = state.TY.conditions[this.id];
                if (conditions[condition]) {
                    let conditionID = conditions[condition];
                    let token = findObjs({_type:"graphic", id: conditionID})[0];
                    if (token) {
                        token.remove();
                    }
                    delete state.TY.conditions[this.id][condition];
                }
            }
        }

        queryCondition(condition) {
            let result = false;
            if (state.TY.conditions[this.id]) {
                let conditions = state.TY.conditions[this.id];
                if (conditions[condition]) {
                    result = true;
                }
            }
            return result;  
        }

        BailOut() {
            let result = {
                result: "",
                tip: "",
            }
            if (this.bailed === true) {
                let roll = randomInteger(6);
                let reroll = CommandReroll(this);
                result.tip = "<br>Remount Roll: " + roll + " vs. " + this.remount + "+";
                if (roll < this.remount && reroll !== -1) {
                    result.tip += "<br>Reroll from Formation Commander: " + reroll;
                }
                roll = Math.max(roll,reroll);  
                if (roll >= this.remount) {
                    result.result = "bailedAgain"
                } else {
                    result.result = "flees"
                }
            } else {
                result.result = "bailed";
                this.bail();
            }
            return result;
        }

        bail() {
            this.addCondition("Bailed Out");
            this.bailed = true;
        }

        remountTank() {
            this.removeCondition("Bailed Out");
            this.bailed = false;
        }

        IC(ic) {
            this.inCommand = ic;
            let colour = "transparent";
            if (ic === false) {
                colour = Colours.black;
            }
            this.token.set("tint_color",colour);
        }

        CheckIC() {
            let ic = false;
            if (this.special.includes("HQ") || this.special.includes("Independent") || this.type === "System Unit") {
                ic = true;
            } else {
                let unit = UnitArray[this.unitID];
                let unitLeader = TeamArray[unit.teamIDs[0]];
                let index = unit.teamIDs.indexOf(this.id);
                if (index === 0) {
                    ic = true;
                    unit.IC();
                } else {
                    let dist = this.hex.distance(unitLeader.hex);
                    let commandRadius = (unit.size > 7 || this.type === "Aircraft" || this.type === "Helicopter") ? 8:6;
                    if (dist <= commandRadius) {
                        ic = true;
                    } 
                }
            }
            this.IC(ic);
        }

        landed() {
            return this.queryCondition("Land/Take Off");
        }

        activated() {
            return (this.token.get("aura1_color") === Colours.black);
        }

        Save(hit,hitNum) {
log(hit)
            let facing = hit.facing;
            let range = hit.range;
            let bp = hit.bp;
            let weapon = hit.weapon;
            let rangedIn = hit.rangedIn;
            let shooterType = hit.shooterType;
            let closeCombat = hit.closeCombat;
            if (!hit.closeCombat) {closeCombat = false};

            let notes = weapon.notes;
            let saveRoll = randomInteger(6);
            let fpRoll = randomInteger(6);
            let saveNeeded = 0;
            let save = {
                result: "",
                tip: hitNum + ": ",
            }

            if (weapon.name === "Smoke") {
                save = {
                    result: "smoked",
                    tip: hitNum + ": Smoke Round",
                }
                return save;
            }

            if (bp === "Artillery") {
                bp = hexMap[this.hexLabel].bp;
                if (hexMap[this.hexLabel].foxholes === true && this.type === "Infantry") {bp = true};
            } 
            if (bp === "Passenger") {
                bp = false;
            }

            if (this.special.includes("Redemption")) {
                bp = false;
            }

            if (this.type === "Tank") {
                if (weapon.type === "Flamethrower") {
                    facing = "Top";
                }

                if (facing === "Front") {saveNeeded = this.armourF};
                if (facing === "Side/Rear") {saveNeeded = this.armourS};
                if (facing === "Top") {saveNeeded = this.armourT};

                saveNeeded = parseInt(saveNeeded);

                if (this.special.includes("Skirts") && hit.weapon.notes.includes("HEAT") && facing !== "Top") {
                    saveNeeded = Math.max(saveNeeded,10);
                }
                if ((this.special.includes("BDD") || this.special.includes("Applique")) && hit.weapon.notes.includes("HEAT") && facing !== "Top") {
                    saveNeeded = Math.max(saveNeeded,13);
                }
                if (this.special.includes("Chobham") && hit.weapon.notes.includes("HEAT") && facing !== "Top") {
                    saveNeeded = Math.max(saveNeeded,16);
                }
                if (this.special.includes("ERA") && hit.weapon.notes.includes("HEAT") && facing !== "Top" && hit.weapon.notes.includes("Tandem") === false) {
                    saveNeeded = Math.max(saveNeeded,16);
                }

                if (weapon.notes.includes("HEAT") === false && weapon.notes.includes("Krasnopol") === false && weapon.notes.includes("NLOS") === false) {
                    if (range > 16) {
                        saveNeeded++;
                        save.tip += "<br>+1 Armour for Long Range<br>";
                    }
                };

                let armourSave = saveRoll + saveNeeded;

                save.tip += "Antitank " + weapon.at + " vs. ";
                save.tip += "<br>" + facing + " Armour: " + saveNeeded + " + Save Roll: " + saveRoll;

                if (weapon.at > (saveNeeded + 6)) {
                    save.tip = hitNum + ": Auto -  AT " + weapon.at + " vs Armour: " + saveNeeded;
                }

                if ((saveNeeded + 1) > weapon.at) {
                    save.tip = hitNum + ": Bounce - Armour: " + saveNeeded + " vs AT " + weapon.at;
                    PlaySound("Ricochet")
                }

                if (armourSave > weapon.at) {
                    save.result = "deflect";
                    PlaySound("Ricochet")
                } else if (armourSave === weapon.at) {
                    save.tip += "<br>Firepower Roll: " + fpRoll + " vs. " + weapon.fp + "+"; 
                    if (fpRoll < weapon.fp) {
                        save.result = "minor"
                    } else {
                        let result = this.BailOut();
                        PlaySound("Hit");
                        save.result = result.result;
                        save.tip += result.tip;
                        if (result.result === "flees") {save.tip = "*" + save.tip}
                    }           
                } else {
                    save.tip += "<br>Firepower Roll: " + fpRoll + " vs. " + weapon.fp + "+"; 
                    if (fpRoll < weapon.fp) {
                        let result = this.BailOut();
                        save.result = result.result;
                        save.tip += result.tip;
                        if (result.result === "flees" && save.tip.charAt(0) != "💀") {
                            save.tip = "💀" + save.tip
                        }
                    } else {
                        if (save.tip.charAt(0) != "💀") {
                            save.tip = "💀" + save.tip
                        }
                        save.result = "destroyed";
                    }
                }
            } else if (this.type === "Infantry" || this.type === "Unarmoured Tank" || this.type === "Gun") {
                if (this.special.includes("Gun Shield") && facing === front && this.order !== "Dash" && bp !== "Artillery") {
                    bp = true;
                }

                saveNeeded = parseInt(this.armourF);
                if (closeCombat === true) {
                    saveNeeded = 7;
                }
                save.tip = hitNum + ": Save Roll: " + saveRoll + " vs. " + saveNeeded + "+";
                if (saveNeeded === 7) {
                    save.tip = hitNum + ": No Save";
                }
                if (rangedIn && this.type === "Infantry" && saveRoll >= saveNeeded) {
                    //reroll passed saves on rangedIn artillery for infantry
                    saveRoll = randomInteger(6);
                    save.tip += "<br>Rerolled due to RangedIn: " + saveRoll;
                }
                if (notes.includes("Brutal") && saveRoll >= saveNeeded) {
                    //reroll passed saves for brutal weapons
                    saveRoll = randomInteger(6);
                    save.tip += "<br>Rerolled due to Brutal Weapon: " + saveRoll;
                }
                if ((weapon.type === "Flamethrower" || notes.includes("Flame-thrower")) && saveRoll >= saveNeeded) {
                    //reroll passed saves for flamethrowers
                    saveRoll = randomInteger(6);
                    save.tip += "<br>Rerolled due to Flamethrower: " + saveRoll;
                }
                if (saveRoll >= saveNeeded) {
                    save.result = "saved";
                } else if (bp === true && this.type !== "Unarmoured Tank") {
                    save.tip += "<br>Firepower Roll: " + fpRoll + " vs. " + weapon.fp + "+";
                    if (fpRoll < weapon.fp) {
                        save.result = "cover";
                    } else {
                        if (save.tip.charAt(0) != "💀") {
                            save.tip = "💀" + save.tip
                        }
                        save.result = "destroyed";
                    }
                } else {
                    if (save.tip.charAt(0) != "💀") {
                        save.tip = "💀" + save.tip
                    }                    
                    save.result = "destroyed";
                }
            } else if (this.type === "Aircraft" || this.type === "Helicopter") {
                //only weapons capable of targetting aircraft/helos should make it to here
                saveNeeded = parseInt(this.armourF);
                save.tip = hitNum + ": Save Roll: " + saveRoll + " vs. " + saveNeeded + "+";
                if (saveRoll >= saveNeeded) {
                    save.result = "saved";
                } else {
                    save.tip += "<br>Firepower Roll: " + fpRoll + " vs. " + weapon.fp + "+";
                    let noRerollWeapons = ["Guided","Guided AA","Anti-helicopter","Dedicated AA"];
                    let notes = weapon.notes.split(",");
                    if (((shooterType === "Infantry" && findCommonElements(noRerollWeapons,notes) === false) || weapon.type === "AA MG") && fpRoll >= weapon.fp) {
                        fpRoll = randomInteger(6);
                        save.tip += "<br>Rerolled: " + fpRoll;
                    }
                    if (fpRoll < weapon.fp) {
                        save.result = "minor";
                    } else {
                        if (save.tip.charAt(0) != "💀") {
                            save.tip = "💀" + save.tip
                        }
                        save.result = "destroyed";
                    }
                } 
            }
            return save;
        }


        kill() {
            log("In Kill")
            log("Team ID: " + this.id)
            if (this.type === "Tank" || this.type === "Helicopter") {
                this.wreck();
                PlaySound("Explosion")
            } else {
                this.token.set({
                    layer: "map",
                    statusmarkers: "dead",

                });
                toFront(this.token);
            }
            delete state.TY.teams[this.id];

            if (state.TY.conditions[this.id]) {
                let keys = Object.keys(state.TY.conditions[this.id]);
                for (let i=0;i<keys.length;i++) {
                    this.removeCondition(keys[i]);
                }
            }
            let unit = UnitArray[this.unitID];
            unit.remove(this);
            delete TeamArray[this.id];
        }

        flees() {
            UnitArray[this.unitID].remove(this);
            if (this.bailed === true) {
                this.wreck();
            } else {
                this.token.remove();
            }
            delete TeamArray[this.id];
        }

        wreck() {
            let tok = this.token;
            if (!tok) {return};
            tok.set("name","WRECK")
            tok.set("showname",false)
            tok.set("layer","map")
            tok.set("statusmarkers","");
            tok.set("aura1_color","transparent");
            tok.set("tint_color","transparent");
            let y = tok.get('top') - 33
            let img = "https://s3.amazonaws.com/files.d20.io/images/250890242/TNggOuyBFT67qEPS1nxIPg/thumb.png?1634484854"
            let x = tok.get("left") + 30
            if (randomInteger(2) === 2) {
                img = "https://s3.amazonaws.com/files.d20.io/images/250892520/gL4-_C7Y7-cYDKW9icsUcg/thumb.png?1634485587"
                x = tok.get("left") + 10
            }
            let newToken = createObj("graphic", {   
                left: x,
                top: y,
                width: 70, 
                height: 70,  
                name: "vehiclefire",
                isdrawing: true,
                pageid: tok.get("pageid"),
                imgsrc: img,
                layer: "map",
                controlledby: "all",
            });
            toFront(newToken);

            hexMap[this.hexLabel].terrain.push("Wreck");
            WreckArray[this.id] = this.hex;
            hexMap[this.hexLabel].bp = true;
            if (hexMap[this.hexLabel].type === 0) {
                hexMap[this.hexLabel].type = 1;
            }

        }




    }












    //Various Routines
    const stringGen = () => {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 6; i++) {
            text += possible.charAt(Math.floor(randomInteger(possible.length)));
        }
        return text;
    }

    const findCommonElements = (arr1,arr2) => {
        //iterates through array 1 and sees if array 2 has any of its elements
        //returns true if the arrays share an element
        return arr1.some(item => arr2.includes(item));
    }

    const returnCommonElements = (array1,array2) => {
        return array1.filter(value => array2.includes(value));
    }

    const simpleObj = (o) => {
        p = JSON.parse(JSON.stringify(o));
        return p;
    }

    const getCleanImgSrc = (imgsrc) => {
        let parts = imgsrc.match(/(.*\/images\/.*)(thumb|med|original|max)([^?]*)(\?[^?]+)?$/);
        if(parts) {
            return parts[1]+'thumb'+parts[3]+(parts[4]?parts[4]:`?${Math.round(Math.random()*9999999)}`);
        }
        return;
    }

    const DeepCopy = (variable) => {
        variable = JSON.parse(JSON.stringify(variable))
        return variable;
    }

    const Attribute = (character,attributename) => {
        //Retrieve Values from Character Sheet Attributes
        let attributeobj = findObjs({type:'attribute',characterid: character.id, name: attributename})[0]
        let attributevalue = "";
        if (attributeobj) {
            attributevalue = attributeobj.get('current');
        }
        return attributevalue;
    }

    const AttributeArray = (characterID) => {
        let aa = {}
        let attributes = findObjs({_type:'attribute',_characterid: characterID});
        for (let j=0;j<attributes.length;j++) {
            let name = attributes[j].get("name")
            let current = attributes[j].get("current")   
            if (!current || current === "") {current = " "} 
            aa[name] = current;

        }
        return aa;
    }

    const AttributeSet = (characterID,attributename,newvalue,max) => {
        if (!max) {max = false};
        if (!newvalue) {newvalue = 0};
        let attributeobj = findObjs({type:'attribute',characterid: characterID, name: attributename})[0]
        if (attributeobj) {
            if (max === true) {
                attributeobj.set("max",newvalue)
            } else {
                attributeobj.set("current",newvalue)
            }
        } else {
            if (max === true) {
                createObj("attribute", {
                    name: attributename,
                    current: newvalue,
                    max: newvalue,
                    characterid: characterID,
                });            
            } else {
                createObj("attribute", {
                    name: attributename,
                    current: newvalue,
                    characterid: characterID,
                });            
            }
        }
    }

    const ButtonInfo = (phrase,action) => {
        let info = {
            phrase: phrase,
            action: action,
        }
        outputCard.buttons.push(info);
    }

    const SetupCard = (title,subtitle,nation) => {
        outputCard.title = title;
        outputCard.subtitle = subtitle;
        outputCard.nation = nation;
        outputCard.body = [];
        outputCard.buttons = [];
        outputCard.inline = [];
    }

    const DisplayDice = (roll,tablename,size) => {
        roll = roll.toString();
        let table = findObjs({type:'rollabletable', name: tablename})[0];
        let obj = findObjs({type:'tableitem', _rollabletableid: table.id, name: roll })[0];
        let avatar = obj.get('avatar');
        let out = "<img width = "+ size + " height = " + size + " src=" + avatar + "></img>";
        return out;
    }

    const PlaySound = (name) => {
        let sound = findObjs({type: "jukeboxtrack", title: name})[0];
        if (sound) {
            sound.set({playing: true,softstop:false});
        }
    };

    const FX = (fxname,team1,team2) => {
        //team2 is target, team1 is shooter
        //if its an area effect, team1 isnt used
        if (fxname.includes("System")) {
            //system fx
            fxname = fxname.replace("System-","");
            if (fxname.includes("Blast")) {
                fxname = fxname.replace("Blast-","");
                spawnFx(team2.location.x,team2.location.y, fxname);
            } else {
                spawnFxBetweenPoints(team1.location, team2.location, fxname);
            }
        } else {
            let fxType =  findObjs({type: "custfx", name: fxname})[0];
            if (fxType) {
                spawnFxBetweenPoints(team1.location, team2.location, fxType.id);
            }
        }
    }

    const Unique = (array,label) => {
        //eliminate duplicate objects in array using a label eg. name if sorting on obj.name
        array = array.reduce((unique, o) => {
            if(!unique.some(obj => obj[label] === o[label])) {
              unique.push(o);
            }
            return unique;
        },[]);
        return array;
    }

    const getAbsoluteControlPt = (controlArray, centre, w, h, rot, scaleX, scaleY) => {
        let len = controlArray.length;
        let point = new Point(controlArray[len-2], controlArray[len-1]);
        //translate relative x,y to actual x,y 
        point.x = scaleX*point.x + centre.x - (scaleX * w/2);
        point.y = scaleY*point.y + centre.y - (scaleY * h/2);
        point = RotatePoint(centre.x, centre.y, rot, point);
        return point;
    }

    const XHEX = (pts) => {
        //makes a small group of points for checking around centre
        let points = pts;
        points.push(new Point(pts[0].x - 20,pts[0].y - 20));
        points.push(new Point(pts[0].x + 20,pts[0].y - 20));
        points.push(new Point(pts[0].x + 20,pts[0].y + 20));
        points.push(new Point(pts[0].x - 20,pts[0].y + 20));
        return points;
    }

    const CentreTeam = (unit) => {
        //centroid of points
        let centre = new Point(0,0);
        for (let i=0;i<unit.teamIDs.length;i++) {
            let team = TeamArray[unit.teamIDs[i]];
            centre.x += team.location.x;
            centre.y += team.location.y;
        }
        centre.x = Math.round(centre.x/unit.teamIDs.length);
        centre.y = Math.round(centre.y/unit.teamIDs.length);
        let centreHex = pointToHex(centre);
        //closest team
        let closestDist = Infinity;
        let closestTeam;
        for (let i=0;i<unit.teamIDs.length;i++) {
            let team = TeamArray[unit.teamIDs[i]];
            let dist = team.hex.distance(centreHex);
            if (dist < closestDist) {
                closestTeam = team;
                closestDist = dist;
            }
        }
        return closestTeam
    }




    const Angle = (theta) => {
        while (theta < 0) {
            theta += 360;
        }
        while (theta > 360) {
            theta -= 360;
        }
        return theta
    }   

    const RotatePoint = (cX,cY,angle, p) => {
        //cx, cy = coordinates of the centre of rotation
        //angle = clockwise rotation angle
        //p = point object
        let s = Math.sin(angle);
        let c = Math.cos(angle);
        // translate point back to origin:
        p.x -= cX;
        p.y -= cY;
        // rotate point
        let newX = p.x * c - p.y * s;
        let newY = p.x * s + p.y * c;
        // translate point back:
        p.x = Math.round(newX + cX);
        p.y = Math.round(newY + cY);
        return p;
    }

    const pointInPolygon = (point,polygon) => {
        //evaluate if point is in the polygon
        px = point.x
        py = point.y
        collision = false
        vertices = polygon.vertices
        len = vertices.length - 1
        for (let c=0;c<len;c++) {
            vc = vertices[c];
            vn = vertices[c+1]
            if (((vc.y >= py && vn.y < py) || (vc.y < py && vn.y >= py)) && (px < (vn.x-vc.x)*(py-vc.y)/(vn.y-vc.y)+vc.x)) {
                collision = !collision
            }
        }
        return collision
    }

    const TokenVertices = (tok) => {
        //Create corners with final being the first
        let corners = []
        let tokX = tok.get("left")
        let tokY = tok.get("top")
        let w = tok.get("width")
        let h = tok.get("height")
        let rot = tok.get("rotation") * (Math.PI/180)
        //define the four corners of the target token as new points
        //also rotate those corners around the target tok centre
        corners.push(RotatePoint(tokX, tokY, rot, new Point( tokX-w/2, tokY-h/2 )))     //Upper left
        corners.push(RotatePoint(tokX, tokY, rot, new Point( tokX+w/2, tokY-h/2 )))     //Upper right
        corners.push(RotatePoint(tokX, tokY, rot, new Point( tokX+w/2, tokY+h/2 )))     //Lower right
        corners.push(RotatePoint(tokX, tokY, rot, new Point( tokX-w/2, tokY+h/2 )))     //Lower left
        corners.push(RotatePoint(tokX, tokY, rot, new Point( tokX-w/2, tokY-h/2 )))     //Upper left
        return corners
      }

      const Name = (nat) => {
        let num = randomInteger(25) - 1;
        let names = {
            Germany: ["Schmidt","Schneider","Fischer","Weber","Meyer","Wagner","Becker","Schulz","Hoffmann","Bauer","Richter","Klein","Wolf","Schroder","Neumann","Schwarz","Braun","Hofmann","Werner","Krause","Konig","Lang","Vogel","Frank","Beck"],
            Soviet: ["Ivanov","Smirnov","Petrov","Sidorov","Popov","Vassiliev","Sokolov","Novikov","Volkov","Alekseev","Lebedev","Pavlov","Kozlov","Orlov","Makarov","Nikitin","Zaitsev","Golubev","Tarasov","Ilyin","Gusev","Titov","Kuzmin","Kiselyov","Belov"],
            USA: ["Smith","Johnson","Williams","Brown","Jones","Wright","Miller","Davis","Wilson","Anderson","Thomas","Taylor","Moore","Jackson","Martin","Lee","Thompson","White","Harris","Clark","Lewis","Robinson","Walker","Young","Allen"],
            UK: ["Smith","Jones","Williams","Taylor","Davies","Brown","Wilson","Evans","Thomas","Johnson","Roberts","Walker","Wright","Robinson","Thompson","White","Hughes","Edwards","Green","Lewis","Wood","Harris","Martin","Jackson","Clarke"],
            Israel: ["Cohen","Levy","Mizrahi","Peretz","Bitton","Dahan","Agbaria","Avaraham","Friedman","Yosef","Amar","Katz","Mhamid","Azoulay","Malkah","Khatib","Zoabi","Jabarin","Vaknin","Weiss","Gabay","Shapiro","Chided","Ohayon","Lavyan"],
            Arabic: ["Khaled","Mohamed","Al numan","Ahmed","Ali","Hussein","Hassan","Ibrahim","Mahmoud","Samaan","Alzuhur","Saleh","Alththania","Allah","Mostafa","Suleiman","Yousef","Aldaman","Khalil","Khalaf","El din","Ismail","Sheik","Hamoud","Omar"],
        
        
        }

        let nameList = names[nat];
        let surname = nameList[num];
        return surname;
    }

    const teamHeight = (team) => {
        //height of token based on terrain, with additional based on type
        let hex = hexMap[team.hexLabel];
        let height = parseInt(hex.elevation);
        if (team.type === "Infantry" && hex.terrain.includes("Building")) {
            height = parseInt(hex.height) - 1;
        } 
        if (team.type === "Aircraft") {
            height += 10;
        }
        if (team.type === "Helicopter" && team.landed() === false) {
            if (team.special.includes("Hunter")) {
                height = parseInt(hex.height) + .5;
            } else {
                height = parseInt(hex.height) + 1;
            }
        }
        return height;
    }

    const ClearState = () => {
        //clear arrays
        UnitArray = {};
        TeamArray = {};
        FormationArray = {};

        SmokeArray = {};
        FoxholeArray = [];
        
        RemoveDead("All");
        RebuildBuildings();
        //clear token info
        let tokens = findObjs({
            _pageid: Campaign().get("playerpageid"),
            _type: "graphic",
            _subtype: "token",
            layer: "objects",
        });

        tokens.forEach((token) => {
            token.set({
                name: "",
                tint_color: "transparent",
                aura1_color: "transparent",
                aura1_radius: 0,
                bar1_value: "",
                bar1_max: "",
                showname: true,
                showplayers_aura1: true,
                gmnotes: "",
                statusmarkers: "",
            });                
        })

        state.TY = {
            nations: [[],[]],
            players: {},
            playerInfo: [[],[]],
            lineArray: [],
            labmode: false,
            darkness: false,
            vision: 5, //randomize if night to d6+2 and show when start
            turn: 0,
            step: "",
            gametype: "",
            timeOfDay: "Day",
            startingPlayer: undefined,
            barrageID: "",
            BarrageInfo: [],
            smokeScreens: [[],[]],
            minelets: [[],[]],
            conditions: {},
            teams: {}, //teamIDs -> unit and formation IDs
            formations: {}, //formationIDs -> name
            units: {},//unitIDs -> name
            passengers: {},//keyed on IDs of transports, arrays of passengerIDs
            currentUnitID: "",
            turnMarkerIDs: ["",""],
            playerSteps: [],
        }

        BuildMap();
        sendChat("","Cleared State/Arrays");
    }

    const RemoveDead = (info) => {
        let tokens = findObjs({
            _pageid: Campaign().get("playerpageid"),
            _type: "graphic",
            _subtype: "token",
        });

        let removals = ["SmokeScreen","rangedin","Foxholes","Smoke","Turn","vehiclefire","WRECK"];
        tokens.forEach((token) => {
            let layer = token.get("layer");
            if (token.get("status_dead") === true) {
                token.remove();
            }
            for (let i=0;i<removals.length;i++) {
                if (removals[i] === token.get("name") && info === "All") {
                    token.remove();
                }
            }
            if ((layer === "gmlayer" || layer === "walls") && info === "All") {
                token.remove();
            }
        });
    }

    const RebuildBuildings = () => {
        let tokens = findObjs({
            _pageid: Campaign().get("playerpageid"),
            _type: "graphic",
            _subtype: "token",
            layer: "map",
        });
        tokens.forEach((token) => {
            if (token.get("name").includes("Building")) {
                let num = token.get("name").replace(/[^\d]/g,"");
                if (!num) {num = 1};
                token.set("bar1_value",num);
            }
            if (token.get("name").includes("Ruined Building")) {
                let num = token.get("name").replace(/[^\d]/g,"");
                if (!num) {num = 1};
                //change token image here
            }
        });
    }

    const DeleteAttribute = (characterID,attributeName) => {
        let attributeObj = findObjs({type:'attribute',characterid: characterID, name: attributeName})[0]
        if (attributeObj) {
            attributeObj.remove();
        }
    }


    const PrintCard = (id) => {
        let output = "";
        if (id) {
            let playerObj = findObjs({type: 'player',id: id})[0];
            let who = playerObj.get("displayname");
            output += `/w "${who}"`;
        } else {
            output += "/desc ";
        }
        if (!outputCard.nation || !Nations[outputCard.nation]) {
            outputCard.nation = "Neutral";
        }
        if (!outputCard.title) {outputCard.title = "No Title, Check Log"}

        //start of card
        output += `<div style="display: table; border: ` + Nations[outputCard.nation].borderStyle + " " + Nations[outputCard.nation].borderColour + `; `;
        output += `background-color: #EEEEEE; width: 100%; text-align: centre; `;
        output += `border-radius: 1px; border-collapse: separate; box-shadow: 5px 3px 3px 0px #aaa;;`;
        output += `"><div style="display: table-header-group; `;
        output += `background-color: ` + Nations[outputCard.nation].backgroundColour + `; `;
        output += `background-image: url(` + Nations[outputCard.nation].image + `), url(` + Nations[outputCard.nation].image + `); `;
        output += `background-position: left,right; background-repeat: no-repeat, no-repeat; background-size: contain, contain; align: centre,centre; `;
        output += `border-bottom: 2px solid #444444; "><div style="display: table-row;"><div style="display: table-cell; padding: 2px 2px; text-align: centre;"><span style="`;
        output += `font-family: ` + Nations[outputCard.nation].titlefont + `; `;
        output += `font-style: normal; `;

        let titlefontsize = "1.4em";
        if (outputCard.title.length > 12) {
            titlefontsize = "1em";
        }

        output += `font-size: ` + titlefontsize + `; `;
        output += `line-height: 1.2em; font-weight: strong; `;
        output += `color: ` + Nations[outputCard.nation].fontColour + `; `;
        output += `text-shadow: none; `;
        output += `">`+ outputCard.title + `</span><br /><span style="`;
        output += `font-family: Arial; font-variant: normal; font-size: 13px; font-style: normal; font-weight: bold; `;
        output += `color: ` +  Nations[outputCard.nation].fontColour + `; `;
        output += `">` + outputCard.subtitle + `</span></div></div></div>`;

        //body of card
        output += `<div style="display: table-row-group; ">`;

        let inline = 0;

        for (let i=0;i<outputCard.body.length;i++) {
            let out = "";
            let line = outputCard.body[i];
            if (!line || line === "") {continue};
            if (line.includes("[INLINE")) {
                let end = line.indexOf("]");
                let substring = line.substring(0,end+1);
                let num = substring.replace(/[^\d]/g,"");
                if (!num) {num = 1};
                line = line.replace(substring,"");
                out += `<div style="display: table-row; background: #FFFFFF;; `;
                out += `"><div style="display: table-cell; padding: 0px 0px; font-family: Arial; font-style: normal; font-weight: normal; font-size: 14px; `;
                out += `"><span style="line-height: normal; color: #000000; `;
                out += `"> <div style='text-align: centre; display:block;'>`;
                out += line + " ";

                for (let q=0;q<num;q++) {
                    let info = outputCard.inline[inline];
                    out += `<a style ="background-color: ` + Nations[outputCard.nation].backgroundColour + `; padding: 5px;`
                    out += `color: ` + Nations[outputCard.nation].fontColour + `; text-align: centre; vertical-align: middle; border-radius: 5px;`;
                    out += `border-color: ` + Nations[outputCard.nation].borderColour + `; font-family: Tahoma; font-size: x-small; `;
                    out += `"href = "` + info.action + `">` + info.phrase + `</a>`;
                    inline++;                    
                }
                out += `</div></span></div></div>`;
            } else {
                line = line.replace(/\[hr(.*?)\]/gi, '<hr style="width:95%; align:centre; margin:0px 0px 5px 5px; border-top:2px solid $1;">');
                line = line.replace(/\[\#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})\](.*?)\[\/[\#]\]/g, "<span style='color: #$1;'>$2</span>"); // [#xxx] or [#xxxx]...[/#] for color codes. xxx is a 3-digit hex code
                line = line.replace(/\[[Uu]\](.*?)\[\/[Uu]\]/g, "<u>$1</u>"); // [U]...[/u] for underline
                line = line.replace(/\[[Bb]\](.*?)\[\/[Bb]\]/g, "<b>$1</b>"); // [B]...[/B] for bolding
                line = line.replace(/\[[Ii]\](.*?)\[\/[Ii]\]/g, "<i>$1</i>"); // [I]...[/I] for italics
                let lineBack = (i % 2 === 0) ? "#D3D3D3" : "#EEEEEE";
                out += `<div style="display: table-row; background: ` + lineBack + `;; `;
                out += `"><div style="display: table-cell; padding: 0px 0px; font-family: Arial; font-style: normal; font-weight: normal; font-size: 14px; `;
                out += `"><span style="line-height: normal; color: #000000; `;
                out += `"> <div style='text-align: centre; display:block;'>`;
                out += line + `</div></span></div></div>`;                
            }
            output += out;
        }

        //buttons
        if (outputCard.buttons.length > 0) {
            for (let i=0;i<outputCard.buttons.length;i++) {
                let out = "";
                let info = outputCard.buttons[i];
                out += `<div style="display: table-row; background: #FFFFFF;; `;
                out += `"><div style="display: table-cell; padding: 0px 0px; font-family: Arial; font-style: normal; font-weight: normal; font-size: 14px; `;
                out += `"><span style="line-height: normal; color: #000000; `;
                out += `"> <div style='text-align: centre; display:block;'>`;
                out += `<a style ="background-color: ` + Nations[outputCard.nation].backgroundColour + `; padding: 5px;`
                out += `color: ` + Nations[outputCard.nation].fontColour + `; text-align: centre; vertical-align: middle; border-radius: 5px;`;
                out += `border-color: ` + Nations[outputCard.nation].borderColour + `; font-family: Tahoma; font-size: x-small; `;
                out += `"href = "` + info.action + `">` + info.phrase + `</a></div></span></div></div>`;
                output += out;
            }
        }

        output += `</div></div><br />`;
        sendChat("",output);
        outputCard = {title: "",subtitle: "",nation: "",body: [],buttons: [],};
    }

    const parseStat = (x) => {
        if (x) {
            p = x.replace(/[^\d]/g, "");
        }
        if (isNaN(p)) {
            p = 7;
        }
        return p;
    }

    const crossStat = (x) => {
        let c = 1;
        if (x) {
            c = parseInt(x);
            if (isNaN(c)) {c = 1};
        }
        return c;
    }

    const LoadPage = () => {
        //build Page Info and flesh out Hex Info
        pageInfo.page = getObj('page', Campaign().get("playerpageid"));
        pageInfo.name = pageInfo.page.get("name");
        pageInfo.scale = pageInfo.page.get("snapping_increment");
        pageInfo.width = pageInfo.page.get("width") * 70;
        pageInfo.height = pageInfo.page.get("height") * 70;

        pageInfo.page.set("gm_opacity",1);

        HexInfo.directions = {
            "Northeast": new Hex(1, -1, 0),
            "East": new Hex(1, 0, -1),
            "Southeast": new Hex(0, 1, -1),
            "Southwest": new Hex(-1, 1, 0),
            "West": new Hex(-1, 0, 1),
            "Northwest": new Hex(0, -1, 1),
        }

        let edges = findObjs({_pageid: Campaign().get("playerpageid"),_type: "path",layer: "map",stroke: "#d5a6bd",});
        let c = pageInfo.width/2;
        for (let i=0;i<edges.length;i++) {
            edgeArray.push(edges[i].get("left"));
        }
        if (edgeArray.length === 0) {
            sendChat("","Add Edge(s) to map and reload API");
            return;
        } else if (edgeArray.length === 1) {
            if (edgeArray[0] < c) {
                edgeArray.push(pageInfo.width)
            } else {
                edgeArray.unshift(0);
            }
        } else if (edgeArray.length === 2) {
            edgeArray.sort((a,b) => parseInt(a) - parseInt(b));
        } else if (edgeArray.length > 2) {
            sendChat("","Error with > 2 edges, Fix and Reload API");
            return
        }
    }


    const BuildMap = () => {
        let startTime = Date.now();
        hexMap = {};
        //builds a hex map, assumes Hex(V) page setting
        let halfToggleX = HexInfo.halfX;
        let rowLabelNum = 0;
        let columnLabel = 1;
        let startX = xSpacing/2;
        let startY = 43.8658278242683;

        for (let j = startY; j <= pageInfo.height;j+=ySpacing){
            let rowLabel = rowLabels[rowLabelNum];
            for (let i = startX;i<= pageInfo.width;i+=xSpacing) {
                let point = new Point(i,j);     
                let label = (rowLabel + columnLabel).toString(); //id of hex
                let hexInfo = {
                    id: label,
                    centre: point,
                    terrain: [], //array of names of terrain in hex
                    terrainIDs: [], //used to see if tokens in same building or such
                    teamIDs: [], //ids of tokens in hex
                    elevation: 0, //based on hills
                    height: 0, //height of top of terrain over elevation
                    smoke: false,
                    smokescreen: false,
                    foxholes: false,
                    type: 0,
                    bp: false,
                    dash: 0,
                };
                hexMap[label] = hexInfo;
                columnLabel += 2;
            }
            startX += halfToggleX;
            halfToggleX = -halfToggleX;
            rowLabelNum += 1;
            columnLabel = (columnLabel % 2 === 0) ? 1:2; //swaps odd and even
        }
    
        BuildTerrainArray();

        let taKeys = Object.keys(TerrainArray);
        for (let i=0;i<taKeys.length;i++) {
            let polygon = TerrainArray[taKeys[i]];
            if (polygon.linear === false) {continue};
            Linear(polygon);
        }

        let keys = Object.keys(hexMap);
        const burndown = () => {
            let key = keys.shift();
            if (key){
                let c = hexMap[key].centre;
                if (c.x >= edgeArray[1] || c.x <= edgeArray[0]) {
                    //Offboard
                    hexMap[key].terrain = ["Offboard"];
                } else {
                    let temp = DeepCopy(hexMap[key]);
                    for (let t=0;t<taKeys.length;t++) {
                        let polygon = TerrainArray[taKeys[t]];
                        if (!polygon) {continue};
                        if (temp.terrain.includes(polygon.name) || polygon.linear === true) {continue};
                        let check = false;
                        let pts = [];
                        pts.push(c);
                        pts = XHEX(pts);
                        let num = 0;
                        for (let i=0;i<5;i++) {
                            check = pointInPolygon(pts[i],polygon);
                            if (i === 0 && check === true) {
                                //centre pt is in hex, can skip rest
                                num = 3;
                                break;
                            }
                            if (check === true) {num ++};
                        }
                        if (num > 2) {
                            temp.terrain.push(polygon.name);
                            temp.terrainIDs.push(polygon.id);
                            if (polygon.name.includes("Smoke")) {
                                temp.smoke = true;
                                if (polygon.name === "SmokeScreen") {
                                    temp.smokescreen = true;
                                }
                                let sInfo = {
                                    hex: key,
                                    id: polygon.tokenID, 
                                    player: polygon.gmnotes,
                                }
                                SmokeArray.push(sInfo); 
                            }
                            if (polygon.name === "Foxholes") {
                                let fInfo = {
                                    hex: key,
                                    id: polygon.id, //id of the Foxhole token, can be used to remove later
                                }
                                FoxholeArray[key] = fInfo;
                                temp.foxholes = true;
                            }
                            if (polygon.name === "rangedin") {
                                let rInfo = {
                                    hex: key,
                                    id: polygon.id,
                                }
                                RangedInArray[polygon.gmnotes] = rInfo; 
                            }

                            if (polygon.bp === true) {temp.bp = true};

                            temp.dash = Math.max(temp.dash,polygon.dash);

                            if (polygon.name.includes("Hill")) {
                                temp.elevation = Math.max(temp.elevation,polygon.height);
                                temp.height = Math.max(temp.elevation,polygon.height)
                            } else {
                                temp.height = Math.max(temp.height,polygon.height);
                                temp.type = Math.max(temp.type,polygon.type);
                            };
                        };
                    };
                    if (temp.terrain.length === 0) {
                        temp.terrain.push("Open Ground");
                    }
                    hexMap[key] = temp;
                }
                setTimeout(burndown,0);
            }
        }
        burndown();

        let elapsed = Date.now()-startTime;
        log("Hex Map Built in " + elapsed/1000 + " seconds");
        //add tokens to hex map, rebuild Team/Unit Arrays
        RebuildArrays();
        //check what is in command
        _.forEach(UnitArray,unit => {
            unit.IC();
        })
        BuildReserve();//places flag on units in reserve when rebuilding a map
    }

    const BuildTerrainArray = () => {
        TerrainArray = {};
        //first look for graphic lines outlining hills etc
        let paths = findObjs({_pageid: Campaign().get("playerpageid"),_type: "path",layer: "map"});
        paths.forEach((pathObj) => {
            let vertices = [];
            toFront(pathObj);
            let colour = pathObj.get("stroke").toLowerCase();
            let t = TerrainInfo[colour];
            if (!t) {return};  
            let path = JSON.parse(pathObj.get("path"));
            let centre = new Point(pathObj.get("left"), pathObj.get("top"));
            let w = pathObj.get("width");
            let h = pathObj.get("height");
            let rot = pathObj.get("rotation");
            let scaleX = pathObj.get("scaleX");
            let scaleY = pathObj.get("scaleY");

            //covert path vertices from relative coords to actual map coords
            path.forEach((vert) => {
                let tempPt = getAbsoluteControlPt(vert, centre, w, h, rot, scaleX, scaleY);
                if (isNaN(tempPt.x) || isNaN(tempPt.y)) {return}
                vertices.push(tempPt);            
            });
            let id = stringGen();
            if (TerrainArray[id]) {
                id += stringGen();
            }
            let linear = (t.name === "Ridgeline" || t.name === "Road") ? true:false;

            let info = {
                name: t.name,
                id: id,
                vertices: vertices,
                centre: centre,
                height: t.height,
                bp: t.bp,
                type: t.type,
                group: t.group,
                obstacle: t.obstacle,
                linear: linear,
                dash: t.dash,
            };
            TerrainArray[id] = info;
        });
        //add tokens on map eg woods, crops
        let mta = findObjs({_pageid: Campaign().get("playerpageid"),_type: "graphic",_subtype: "token",layer: "map",});
        mta.forEach((token) => {
            let truncName = token.get("name").toLowerCase();
            truncName = truncName.trim();
            if (truncName.includes("rubble")) {
                truncName === "rubble";
            }
            if (truncName.includes("building")) {
                truncName = truncName.slice(0,-1);
            }
            let t = MapTokenInfo[truncName];
            if (!t) {
                return;
            };
            let vertices = TokenVertices(token);
            let centre = new Point(token.get('left'),token.get('top'));
            let hex = pointToHex(centre);
            let id = stringGen();
            if (TerrainArray[id]) {
                id += stringGen();
            }
            let info = {
                name: t.name,
                id: id,
                tokenID: t.id,
                gmnotes: decodeURIComponent(token.get("gmnotes")),
                vertices: vertices,
                centre: centre,
                height: t.height,
                bp: t.bp,
                type: t.type,
                group: t.group,
                obstacle: t.obstacle,
                linear: false,
                dash: t.dash,
            };
            TerrainArray[id] = info;
            if (t.name === "WRECK") {
                WreckArray[id] = hex;
            }
        });
    };

    const Linear = (polygon) => {
        //adds linear obstacles, eg Ridgelines, to hex map
        let vertices = polygon.vertices;
        for (let i=0;i<(vertices.length - 1);i++) {
            let hexes = [];
            let pt1 = vertices[i];
            let pt2 = vertices[i+1];
            let hex1 = pointToHex(pt1);
            let hex2 = pointToHex(pt2);
            hexes = hex1.linedraw(hex2);
            for (let j=0;j<hexes.length;j++) {
                let hex = hexes[j];
                let hexLabel = hex.label();
                if (!hexMap[hexLabel]) {continue};
                if (hexMap[hexLabel].terrain.includes(polygon.name)) {continue};
                hexMap[hexLabel].terrain.push(polygon.name);
                hexMap[hexLabel].terrainIDs.push(polygon.id);
                hexMap[hexLabel].los = Math.max(hexMap[hexLabel].los,polygon.los);
                hexMap[hexLabel].cover = Math.max(hexMap[hexLabel].cover,polygon.cover);
                hexMap[hexLabel].move = Math.max(hexMap[hexLabel].move,polygon.move);
                hexMap[hexLabel].obstacle = Math.max(hexMap[hexLabel].obstacle,polygon.obstacle);
                hexMap[hexLabel].height = Math.max(hexMap[hexLabel].height,polygon.height);
                if (polygon.cover === 2) {
                    hexMap[hexLabel].coverID = polygon.id
                }
            }
        }
    }

    const RebuildArrays = () => {
        UnitArray = {};
        TeamArray = {};
        FormationArray = {};
        let startTime = Date.now();
        if (!state.TY.teams) {
            log("No Teams in Array")
            return;
        }

        let add = 0;
        let remove = 0;

        let teamKeys = Object.keys(state.TY.teams);
        for (let i=0;i<teamKeys.length;i++) {
            let id = teamKeys[i];
            let token = findObjs({_type:"graphic", id: id})[0];
            if (!token) {
                delete state.TY.teams[id];
                remove++;
                continue;
            }
            let character =  getObj("character", token.get("represents")); 
            if (!character) {
                continue;
            }
            let nation = Attribute(character,"nation");

            let teamInfo = state.TY.teams[id];
            let fid = teamInfo.formationID;
            let uid = teamInfo.unitID;

            let fName = state.TY.formations[fid];
            let uName = state.TY.units[uid];

            let formation,unit,team;
            if (!FormationArray[fid]) {
                formation = new Formation(nation,fid,fName);
            } else {
                formation = FormationArray[fid];
            }
            if (!UnitArray[uid]) {
                unit = new Unit(nation,uid,uName,fid);
                formation.add(unit);
            } else {
                unit = UnitArray[uid];
            }
            team = new Team(id,fid,uid);

            unit.add(team);
            add++;
        }
        let elapsed = Date.now()-startTime;
        log(add + " Teams added to array in " + elapsed/1000 + " seconds");
        if (remove > 0) {
            log(remove + " Teams removed from Array as no Token");
        }
    }

    const Facing = (id1,id2) => { //id2 is the target, id1 is the shooter - returns the facing of id 2
        let facing = "Front";
        let team1 = TeamArray[id1];
        let vertices1 = TokenVertices(team1.token);
        let team2 = TeamArray[id2];
        let vertices2 = TokenVertices(team2.token);
        //top corners of target, to define its front line
        let A = vertices2[0];    //Upper left
        let B = vertices2[1];    //Upper right
        //  center of the target token
        let C2 = team2.location;
        let D = ((C2.x - A.x) * (B.y - A.y)) - ((C2.y - A.y) * (B.x - A.x)) //for the target - where front line is relative to centre
        D = Math.sign(D)
        //D will be (-) if on one side, (+) if on other of front line
        // for reference use vertices of shooter
        for (let i=0;i<4;i++) {
            let C1 = vertices1[i]
            // https://math.stackexchange.com/questions/274712/calculate-on-which-side-of-a-straight-line-is-a-given-point-located
            let E = ((C1.x - A.x) * (B.y - A.y)) - ((C1.y - A.y) * (B.x - A.x)) //for the shooter - where vertice is relative to front line of target
            E = Math.sign(E)
            //E will be (-) or (+) based on which side of front line, and if E is same sign as D is on same side as centre ie. behind front line
            if (D===E || E === 0) {
                facing = "Side/Rear"
                break;
            } 
        }
        return facing
    }

    const UnitCreation = (msg) => {
        if (!msg.selected) {return};
        let Tag = msg.content.split(";");
        let unitName = Tag[1];
        let teamIDs = [];
        for (let i=0;i<msg.selected.length;i++) {
            teamIDs.push(msg.selected[i]._id);
        }
        let refToken = findObjs({_type:"graphic", id: teamIDs[0]})[0];
        let refChar = getObj("character", refToken.get("represents")); 
        if (!refChar) {
            sendChat("","Error, NonCharacter Token");
            return;
        }
        let nation = Attribute(refChar,"nation");

        let formationKeys = Object.keys(FormationArray);
        let supportFlag = false;
        if (formationKeys.length > 0) {
            for (let i=0;i<formationKeys.length;i++) {
                let formation = FormationArray[formationKeys[i]];
                if (formation.nation !== nation) {continue}
                if (formation.name === "Support") {
                    supportFlag = true;
                    break;
                }
            }
        }

        if (supportFlag === false) {
            support = new Formation(nation,stringGen(),"Support");
        }

        let newID = stringGen();
        SetupCard("Unit Creation","",nation);
        outputCard.body.push("Select Existing Formation or New");

        ButtonInfo("New","!UnitCreation2;" + newID + ";?{Formation Name}");
        formationKeys = Object.keys(FormationArray); //redone as Support may have been added

        for (let i=0;i<formationKeys.length;i++) {
            let formation = FormationArray[formationKeys[i]];
            if (formation.nation !== nation) {continue};
            if (formation.name === "Barrages") {continue};
            let action = "!UnitCreation2;" + formation.id;
            ButtonInfo(formation.name,action);
        }

        PrintCard();

        unitCreationInfo = {
            nation: nation,
            newID: newID,
            teamIDs: teamIDs,
            unitName: unitName,
        }
    }

    const UnitCreation2 = (msg) => {
        let Tag = msg.content.split(";");
        let unitName = unitCreationInfo.unitName;
        let nation = unitCreationInfo.nation;
        let player = (WarsawPact.includes(nation)) ? 0:1;
        let teamIDs = unitCreationInfo.teamIDs;
        let formationID = Tag[1];
        let formation = FormationArray[formationID];

        if (!formation) {
            formation = new Formation(nation,formationID,Tag[2]);
        }
        let unit = new Unit(nation,stringGen(),unitName,formationID);

        unit.number = formation.unitIDs.length;
        let unitMarker = Nations[nation].platoonmarkers[unit.number];
        formation.add(unit);

        teamIDs.sort((a,b) => {
            let tokenA = findObjs({_type:"graphic", id: a})[0];
            let tokenB = findObjs({_type:"graphic", id: b})[0];
            let charA = getObj("character", tokenA.get("represents")); 
            let charB = getObj("character", tokenB.get("represents")); 
            if (!charA || !charB) {return 0};
            let rankA = parseInt(Attribute(charA,"rank"));
            let rankB = parseInt(Attribute(charB,"rank"));
            if (rankA > rankB) {return -1};
            if (rankA < rankB) {return 1};
            return 0;
        });

        log(formation)
        log(unit)

        for (let i=0;i<teamIDs.length;i++) {
            let team = new Team(teamIDs[i],formationID,unit.id);
            if (!team) {continue};
            unit.add(team);
            let aura = "transparent";
            if (i === 0) {
                aura = Colours.green
            };
            let name = NameAndRank(team,i);
            team.name = name;
            let hp = parseInt(team.starthp);
            let r = (team.type === "Infantry") ? 7:0.1;
            team.token.set({
                name: name,
                tint_color: "transparent",
                aura1_color: aura,
                aura1_radius: r,
                showplayers_aura1: true,
                showname: true,
                statusmarkers: unitMarker,
            })
            if ((team.type === "Infantry" || team.type === "Unarmoured Tank") && hp > 1) {
                team.token.set({
                    bar1_value: hp,
                    bar1_max: hp,
                    compact_bar: "standard",
                    showplayers_bar1: true,
                    playersedit_bar1: true,
                });
            } 
        }
        if (state.TY.nations[player].includes(nation) === false) {
            state.TY.nations[player].push(nation);
        }
        sendChat("",unitName + " Added to " + formation.name)
    }


    const NameAndRank = (team,i) => {
        let name = team.characterName.replace(team.nation + " ","");
        let unit = UnitArray[team.unitID];
        let unitNumber = unit.num;
        let letter = rowLabels[unitNumber];
        if (team.type.includes("Tank")) {
            name = name.replace(team.nation + " ","");
            let item = ((unit.number+1) * 100) + i
            name += " " + item.toString();
        } else if (team.type === "Infantry" || team.type === "Gun") {
            name += " "+ letter + "/" + i;
        } 
        let rank;
        if (team.special.includes("HQ") || team.token.get(SM.HQ) === true) {
            rank = Math.min(i,1);
            unit.hqUnit = true;
            name = Ranks[Nations[team.nation].ranks][rank] + Name(Nations[team.nation].names);
        } else {
            if (team.type === "Aircraft" || team.special.includes("Independent")) {
                rank = 2;
                unit.aircraft = true;
                if (WarsawPact.includes(team.nation)) {rank=3};
                name = Ranks[Nations[team.nation].ranks][rank] + Name(Nations[team.nation].names);
            }  else if (i === 0) {
                rank = 2;
                if (WarsawPact.includes(team.nation) && unit.artillery === true) {rank=3};
                if (team.special.includes("Passengers")) {rank++}
                name = Ranks[Nations[team.nation].ranks][rank] + Name(Nations[team.nation].names);
            } 
        }
        return name;
    }

    const PromotedName = (team,oldTeam) => {
        let name = team.name;
        if (!oldTeam) {oldTeam = " "};
        let oldRank = name.split(" ")[0];
        let ranks = Ranks[Nations[team.nation].ranks];
        let index = ranks.indexOf(oldRank);
        newRank = ranks[index - 1] || ranks[ranks.length - 1];
        name = newRank + Name(Nations[team.nation].names);
        return name;
    }


    const TokenInfo = (msg) => {
        if (!msg.selected) {
            sendChat("","No Token Selected");
            return;
        };
        let id = msg.selected[0]._id;
        let data = TokenCondition.LookUpMaster(id);
        if (data) {
            id = data.target;
        }

        let team = TeamArray[id];
        if (!team) {
            sendChat("","Not in Team Array Yet");
            return;
        };
        let nation  = team.nation;
        if (!nation) {nation = "Neutral"};
        SetupCard(team.name,"Hex: " + team.hexLabel,nation);
        let h = hexMap[team.hexLabel];

        let terrain = h.terrain;
        terrain = terrain.toString();
        let elevation = teamHeight(team);
        let unit = UnitArray[team.unitID];
        outputCard.body.push("Terrain: " + terrain);
        let covers = ["Flat Terrain","Short Terrain","Tall Terrain","a Building"];
        outputCard.body.push(team.name + " is in " + covers[h.type]);
        if (h.bp === true || h.foxholes === true) {
            outputCard.body.push("(Bulletproof Cover)");
        }
        outputCard.body.push("Elevation: " + (elevation * 50) + " Metres");
        outputCard.body.push("[hr]");
        if (team.inCommand === true) {
            outputCard.body.push("Team is In Command");
        } else {
            outputCard.body.push("Team is NOT In Command");
        }
        if (team.bailed === true) {
            outputCard.body.push("[#ff0000]Team is Bailed Out[/#]");
        }
        if (team.order === "") {
            outputCard.body.push("No Order this Turn");
        } else {
            outputCard.body.push("Team Order: " + team.order);
        }
        if (team.specialorder !== "") {
            outputCard.body.push("Special Order: " + team.specialorder);
        }
        if (state.TY.passengers[team.id]) {
            outputCard.body.push("[hr]");
            outputCard.body.push("[U]Passengers[/u]");
            let passengers = state.TY.passengers[team.id];
            for (let i=0;i<passengers.length;i++) {
                let passengerTeam = TeamArray[passengers[i]];
                outputCard.body.push(passengerTeam.name);
            }
        }

        outputCard.body.push("[hr]");
        outputCard.body.push("Unit: " + unit.name);
        outputCard.body.push("# Teams: " + unit.teamIDs.length);
        if (unit.order === "") {
            outputCard.body.push("No Order this Turn");
        } else {
            outputCard.body.push("Unit Order: " + unit.order);
        }
        if (unit.pinned() === true) {
            outputCard.body.push("[#ff0000]Unit is Pinned[/#]");
        }

        PrintCard();
    }

    const LOS = (id1,id2,special) => {
        if (!special || special === "") {special = " "}; //  overhead - ignores concealment/BP for Short and intervening units, Spotter
        
        let team1 = TeamArray[id1];
        let team2 = TeamArray[id2];
        if (!team1) {
            log("No Team 1: " + id1)
        }
        if (!team2) {
            log("No Team 2: " + id2)
        }
    
        let distanceT1T2 = team1.hex.distance(team2.hex);
        let losReason = "";
    
        if (state.TY.darkness === true && team2.queryCondition("Flare") === false && special.includes("NLOS") === false) {
            let vision = state.TY.vision;
            if (team1.special.includes("Infra-Red")) {
                vision = NightVision.IR
            }
            if (team1.special.includes("Thermal Imaging")) {
                vision = NightVision.Gen1Thermal;
            }
            if (team1.special.includes("2nd Gen Thermal Imaging")) {
                vision = NightVision.Gen2Thermal;
            }
            //check if adjacnt to burning wreck
            let wreckKeys = Object.keys(WreckArray);
            for (let w=0;w<wreckKeys.length;w++) {
                let dist = WreckArray[wreckKeys[w]].distance(team2.hex);
                if (dist <= 1) {
                    vision = distanceT1T2 + 3;
                    break;
                }
            }

            if (distanceT1T2 > vision) {
                let result = {
                    los: false,
                    concealed: false,
                    bulletproof: false,
                    smoke: false,
                    facing: facing,
                    shooterface: shooterFace,
                    distance: distanceT1T2,
                    special: special,
                }
                losReason = "Distance > Night Vision Range";
                return result;   
            }
        }
    
        let facing = Facing(id1,id2);
        let shooterFace = Facing(id2,id1);
        let team1Height = teamHeight(team1);
        let team2Height = teamHeight(team2);
        let teamLevel = Math.min(team1Height,team2Height);
        team1Height -= teamLevel;
        team2Height -= teamLevel;
    //log("Team1 H: " + team1Height)
    //log("Team2 H: " + team2Height)
    
        let interHexes = team1.hex.linedraw(team2.hex); //hexes from shooter (hex 0) to target (hex at end)
        let team1Hex = hexMap[team1.hexLabel];
        let team2Hex = hexMap[team2.hexLabel];
        let sameTerrain = findCommonElements(team1Hex.terrainIDs,team2Hex.terrainIDs);
        let lastElevation = team1Height;

        let hexesWithBuild = 0;
        let hexesWithTall = 0;
        let concealed = false;
        let bulletproof = false;
        let smoke = false;
        let los = true;
    
        if (special.includes("NLOS")) {
            if (team2.type === "Infantry" && team2.moved === false && team2Hex.bp === true) {
                let result = {
                    los: true,
                    concealed: true,
                    bulletproof: team2Hex.bp,
                    smoke: false,
                    facing: facing,
                    shooterface: shooterFace,
                    distance: distanceT1T2,
                    special: special,
                }
                return result;    
            } else if (team2.type !== "Aircraft" || team2.type !== "Helicopter") {
                let result = {
                    los: true,
                    concealed: true,
                    bulletproof: team2Hex.bp,
                    smoke: false,
                    facing: facing,
                    shooterface: shooterFace,
                    distance: distanceT1T2,
                    special: special,
                }
                return result;    
            } else {
                let result = {
                    los: false,
                    concealed: true,
                    bulletproof: false,
                    smoke: false,
                    facing: facing,
                    shooterface: shooterFace,
                    distance: distanceT1T2,
                    special: special,
                }
                losReason = "Invalid Target"
                return result;    
            }
        }


        let fKeys = Object.keys(TeamArray);

        if ((team2Hex.bp === true || team2Hex.foxholes === true) && team2.type === "Infantry") {
            //this catches foxholes, craters and similar
            concealed = true;
            bulletproof = true;
        }
    
        if (team2Hex.terrain.includes("Ridgeline") && team1Hex.terrain.includes("Ridgeline") === false && team1Height < team2Height) {
            //on a ridgeline with shooter below, ie hulldown
            concealed = true;
            bulletproof = true;
        }

        let air1 = false;
        if (team1.type === "Aircraft" || (team1.type === "Helicopter" && team1.landed() === false)) {
            air1 = true;
        }
        let air2 = false;
        if (team2.type === "Aircraft" || (team2.type === "Helicopter" && team2.landed() === false)) {
            air2 = true;
        }


log(interHexes)        
log("Air1: " + air1)
log("Air2: " + air2)
        if (air1 === true && air2 === true) {
log("Both Air")
            if (team2.special.includes("Hunter-Killer")) {
                let st = Math.max(interHexes.length - (2 + 1),0); //2 hexes before target plus target hex
                for (let i=st;i<interHexes.length;i++) {
                    let qrs = interHexes[i];
                    let interHex = hexMap[qrs.label()];
                    if (interHex.type > 1) {
                        concealed = true;
                    }
                    if (interHex.smoke === true || interHex.smokescreen) {smoke = true};
                }
            }
        } else if (air1 === true && air2 === false) {
log("Shooter is Air")
            let st = Math.max(interHexes.length - (2 + 1),0); //2 hexes before target plus target hex
            for (let i=st;i<interHexes.length;i++) {
                let qrs = interHexes[i];
                let interHex = hexMap[qrs.label()];
                if (interHex.type > 1) {
                    concealed = true;
                }
                if (interHex.smoke === true || interHex.smokescreen) {smoke = true};
            }
        } else if (air1 === false && air2 === true) {
log("Target is Air")
            let en = Math.min(interHexes.length,(2 + 1)); //2 hexes from shooter plus shooters hex
            for (let i=0;i<en;i++) {
                let qrs = interHexes[i];
log(qrs.label())
                let interHex = hexMap[qrs.label()];
                if (interHex.type > 1) {
                    concealed = true;
                }                
                if (interHex.smoke === true) {smoke = true};
log(concealed)
            }
            if (team2.special.includes("Hunter-Killer")) {
log("HK")
                let st = Math.max(interHexes.length - (2 + 1),0); //2 hexes before target plus target hex
                for (let i=st;i<interHexes.length;i++) {
                    let qrs = interHexes[i];
log(qrs.label())                    
                    let interHex = hexMap[qrs.label()];
log(interHex)
                    if (interHex.type > 1) {
                        concealed = true;
                    }
                    if (interHex.smoke === true || interHex.smokescreen) {smoke = true};
log(concealed)
                }
            }
        } else if (air1 === false && air2 === false) {
log("Neither is Air")
            for (let i=0;i<interHexes.length;i++) {
                let qrs = interHexes[i];
                let qrsLabel = qrs.label();
                let interHex = hexMap[qrsLabel];
//log(i + ": " + qrsLabel)
//log(interHex.terrain)
//log("Type: " + interHex.type)
                if (interHex.smoke === true || interHex.smokescreen === true) {smoke = true};
                if (interHex.smokescreen === true && distanceT1T2 > 2) { ///6mm change
                    los = false;
                    break;
                }

                let interHexElevation = parseInt(interHex.elevation) - teamLevel;
                let interHexHeight = parseInt(interHex.height);
                let B;
                if (team1Height > team2Height) {
                    B = (distanceT1T2 - i) * team1Height / distanceT1T2;
                } else if (team1Height <= team2Height) {
                    B = i * team2Height / distanceT1T2;
                }
    //log("InterHex Height: " + interHexHeight);
    //log("InterHex Elevation: " + interHexElevation);
    //log("Last Elevation: " + lastElevation);
    //log("B: " + B)
                if (interHexElevation < lastElevation && lastElevation > team1Height && lastElevation > team2Height) {
                    los = false;
                    losReason = "Terrain Drops off at " + qrsLabel;
                    break;
                }            

                let friendlyFlag = false;
                let friendlyHeight = 0;
    
                if (special !== "Overhead" && special !== "Spotter" && special !== "Defensive" && i> 1) {
        //check for intervening friendlies in the way - can ignore if same unit
                    //if find one, flag and note height (in case lower elevation)
        //log("Friendlies")
                    for (let t=0;t<fKeys.length;t++) {
                        let fm = TeamArray[fKeys[t]];
                        if (fm.id === team1.id || fm.id === team2.id || fm.player !== team1.player || fm.unitID === team1.unitID) {continue};
                        if (fm.type === "Infantry" && fm.moved === false) {continue}; //ignore these infantry
                        if (fm.hex === qrs) {
        //log(fm.name)
                            friendlyFlag = true;
                            fmHeight = teamHeight(fm);
                            friendlyHeight = Math.max(fmHeight,friendlyHeight);
                            if (special === "Flamethrower") {friendlyHeight = 100}; //basically cant fire Flamethrower over heads of friendlies
                        }
                    }
                }

                lastElevation = interHexElevation;

                if (interHexHeight + interHexElevation + friendlyHeight >= B) {
                    if (friendlyFlag === true) {
                        losReason = "Friendly at " + qrsLabel + " blocks LOS"
                        los = false;
                        break;
                    }
    //log("Terrain higher than B")
                    //distances set to 1 for 6mm scale
                    if (i>1) {
                        if (interHex.type === 3) {
                            hexesWithBuild++;
                        }
                        if (hexesWithBuild > 1) {
                            los = false;
                            losReason = "> 1 hexes into Building at " + qrsLabel;
                            break;
                        }
                        if (hexesWithBuild > 1 && interHex.type < 3) {
                            los = false;
                            losReason = "Other side of Building at " + qrsLabel;
                            break;
                        }


                        if (interHex.type === 2) {
                            hexesWithTall++;
                        }
                        if (hexesWithTall > 1 && distanceT1T2 > 3) {
                            los = false;
                            losReason = "> 1 hexes through Tall terrain at " + qrsLabel; 
                            break;
                        }
                        if (interHex.type > 1) {
                            concealed = true;
                        }
                        if (interHex.type == 1 && special !== "Overhead") {
                            concealed = true;
                        }
                        if (interHex.bp === true && special !== "Overhead") {
                            bulletproof = true;
                        }
                    }
                } else {
    //log("Terrain less than B")

                }
            }
            if (team2.type === "Infantry" && team2.moved === false) {
                concealed = true //infantry teams that didnt move are concealed to all but Aircraft
        //log("Infantry didnt move = Concealed")
            }
        }


    
        if (special.includes("Defensive")) {
            bulletproof = false
            facing = "Side/Rear"
        };

        if (team2.special.includes("Redemption")) {
            bulletproof = false;
        }
    
        let result = {
            los: los,
            losReason: losReason,
            concealed: concealed,
            bulletproof: bulletproof,
            smoke: smoke,
            facing: facing,
            shooterface: shooterFace,
            distance: distanceT1T2,
            special: special,
        }
        return result;
    }

    
    const TestLOS = (msg) => {
        let Tag = msg.content.split(";");
        let id1 = Tag[1];
        let id2 = Tag[2];
        if (!id1 || !id2) {return};
        let team1 = TeamArray[id1];
        let team2 = TeamArray[id2];
    
        SetupCard("LOS","",team1.nation);
        outputCard.body.push(team1.name + " looking at " + team2.name);
    
        let losResult = LOS(id1,id2,"");
        let distance = parseInt(losResult.distance);
        let metres = distance*50;
        if (metres > 1000) {
            metres /= 1000;
            metres = metres.toString() + "km"
        } else {
            metres += "m";
        }
        metres = " (" + metres + ")";

        outputCard.body.push("[hr]");
        outputCard.body.push("Distance: " + distance + " hexes" + metres);
        outputCard.body.push("LOS: " + losResult.los);

        if (losResult.los !== false) {
            outputCard.body.push("Concealed: " + losResult.concealed);
            if (team2.type === "Infantry") {
                outputCard.body.push("Bulletproof Cover: " + losResult.bulletproof);
            }
            outputCard.body.push("Smoke: " + losResult.smoke);
            if (team2.type === "Tank") {
                outputCard.body.push(team2.name + " Facing: " + losResult.facing);
            }
        } else {
            outputCard.body.push(losResult.losReason);
        }
    
        PrintCard();
    }

    const SetupGame = (msg) => {
        state.TY.turn = 0;
        let Tag = msg.content.split(";");
        let gametype = Tag[1];
        let timeOfDay = Tag[2];
        if (timeOfDay === "Random") {
            let roll = randomInteger(6);
            if (roll < 3) {timeOfDay = "Dawn"};
            if (roll === 3 || roll === 4) {timeOfDay = "Daylight"};
            if (roll > 4) {timeOfDay = "Dusk"};
        }
        state.TY.gametype = gametype;
        state.TY.timeOfDay = timeOfDay;
        state.TY.darkness = false;
        if (timeOfDay === "Dawn" || timeOfDay === "Night") {
            state.TY.darkness = true;
            state.TY.vision = randomInteger(6) + 2;
        }
        SetupCard("Setup New Game","","Neutral");
        outputCard.body.push("Game Type: " + gametype);
        outputCard.body.push("Time of Day: " + timeOfDay);
        if (state.TY.darkness === true) {
            outputCard.body.push("Visibility is " + state.TY.vision + " hexes");
        }
        PrintCard();
    }
    
    const GM = () => {
        SetupCard("GM Functions","","Neutral");
        ButtonInfo("Add Abilities","!AddAbilities");
        ButtonInfo("Clear State","!ClearState");
        ButtonInfo("Place in Reserve","!PlaceInReserve");

        //ButtonInfo("Kill Selected Team","!!KillTeam;@{selected|token_id}");
        ButtonInfo("Setup New Game","!SetupGame;?{Game Type|Meeting Engagement|Attack/Defend};?{Time of Day|Daylight|Dawn|Dusk|Night|Random}");
        //ButtonInfo("Test LOS","!TestLOS;@{selected|token_id};@{target|token_id}");
        //ButtonInfo("Unit Creation","!UnitCreation;?{Unit Name};?{Formation Name};?{Support|No|Yes};");
        //ButtonInfo("Team Unit Info","!TeamInfo");
        PrintCard();
    }

    const LaserGuided = (id) => {
        let team = TeamArray[id];
        let artWeapon = team.artilleryWpn;
        let weapon;
        if (NATO.includes(team.nation)) {
            weapon = {
                name: "Copperhead Projectile",
                minRange: 16,
                maxRange: artWeapon.maxRange,
                halted: 1,
                moving: 1,
                at: 21,
                fp: 2,
                notes: "Brutal, Guided, HEAT",
                type: "Vehicle Missile",
            }
        } else {
            weapon = {
                name: "Krasnopol Projectile",
                minRange: 16,
                maxRange: artWeapon.maxRange,
                halted: 1,
                moving: 1,
                at: 4,
                fp: 1,
                notes: "Brutal, Guided, Krasnopol",
                type: "Vehicle Missile",
            }
        }
        return weapon
    }

    const ActivateUnit = (msg) => {
        RemoveLines();
        RemoveBarrageToken();
        if (!msg.selected) {
            sendChat("","No Token Selected");
            return;
        };
        let teamID = msg.selected[0]._id;
        let data = TokenCondition.LookUpMaster(teamID);
        if (data) {
            teamID = data.target;
        }
        let Tag = msg.content.split(";");
        let order = Tag[1];
        let team = TeamArray[teamID];
        let unit = UnitArray[team.unitID];
        let errorMsg = "";
    
        if (state.TY.currentUnitID !== "") {
            let curUnit = UnitArray[state.TY.currentUnitID];
            if (curUnit) {
                GTG(curUnit);
                curUnit.IC();
            }
        }
    
        let unitLeader = TeamArray[unit.teamIDs[0]];
        let targetTeam,targetName,noun,verb,noun2;
        let extraLine = "";
        let targetArray = [];
        let unitActivation = false;
        let spotted = false;

        if (team.id === unitLeader.id) {
            targetTeam = unitLeader;
            targetName = unit.name;
            _.forEach(unit.teamIDs,id => {
                let tm = TeamArray[id];
                if (tm.inCommand === true && tm.bailed === false) {
                    targetArray.push(tm);
                    if (tm.queryCondition("Spot") === true) {
                        spotted = true;
                    }
                }
            });
            unitActivation = true;
            noun = "Teams ";
            verb = " are ";
            noun2 = " their ";
        } else {
            targetTeam = team;
            targetName = team.name;
            targetArray.push(team);
            if (targetTeam.queryCondition("Spot") === true) {
                spotted = true;
            };
            noun = "The Team ";
            verb = " is ";
            noun2 = " its ";
            if (targetTeam.inCommand === false) {
                outputCard.body.push("Out of Command Team");
                outputCard.body.push("[hr]");
                if (order === "Assault") {
                    errorMsg = "Out of Command Teams cannot Assault";
                };
                if (order === "Tactical" || order === "Hold") {
                    extraLine = "Firing suffers an additional +1 Penalty";
                };
                if (order === "Dash") {
                    if (spotted === false) {
                        extraLine = "Team must move towards the Unit Leader";
                    } else if (spotted === true) {
                        errorMsg = "Team Called Artillery and Cannot Dash";
                    };
                };
            }
        }

        if (order === "Dash" && targetTeam.specialorder.includes("Blitz")) {errorMsg = "Cannot Dash due to Blitz"};
        if (order !== "Hold" && targetTeam.specialorder.includes("Dig In")) {errorMsg = "Cannot due to Dig In Special Order"};

        if (targetTeam.activated() === true) {
            errorMsg = "Team/Unit has already been activated";
        }
        ClearSmoke(unit.id);
    
        if (order === "Assault" && unit.pinned() === true) {
            errorMsg = "Unit is Pinned, cannot Assault";
        }
        
        SetupCard(targetName,"",targetTeam.nation);
    
        if (errorMsg !== "") {
            outputCard.body.push(errorMsg);
            PrintCard();
            return;
        }

        if (order.includes("Tactical")) {
            if (unit.type === "Helicopter") {
                outputCard.body.push(noun + "can move up to" + noun2 + "Speed, and may fire at" + noun2 + "Moving ROF");
                outputCard.body.push("Alternately the Unit can move off table and Loiter");
            } else {
                if (unit.pinned() === false) {
                    outputCard.body.push(noun + "can move at Tactical Speed, and may fire at" + noun2 + "Moving ROF");
                    outputCard.body.push(noun + 'cannot move into contact with enemies');
                } else {
                    outputCard.body.push(noun + "can move at Tactical Speed, and may fire at" + noun2 + "Moving ROF");
                    outputCard.body.push(noun + "cannot move closer to enemy teams");
                } 
                if (spotted === true) {
                    outputCard.body.push("Teams that Called Artillery must remain Stationary");
                }
            }    
        } else if (order.includes("Dash")) {
            outputCard.body.push(noun + ' can move at Dash Speed, but may not fire');
            outputCard.body.push(noun + ' cannot move within 4 hexes of visible enemies');
            if (state.TY.darkness === true) {
                outputCard.body.push("Darkness limits speed to Terrain Dash");
            }
            if (spotted === true) {
                outputCard.body.push("Teams that Called Artillery must remain Stationary");
            }
        } else if (order.includes("Hold")) {
            if (unit.pinned() === false) {
                outputCard.body.push(noun + " stay in place, and may fire at" + noun2 + "Halted ROF");
            } else {
                outputCard.body.push(noun + " stay in place, and may fire at" + noun2 + "Moving ROF");
            }
            outputCard.body.push(noun + verb + "Gone to Ground if not Firing");
            outputCard.body.push(noun + " may also take Opportunity Fire during this turn");
        } else if (order === "Assault") {
            outputCard.body.push('Teams can move at Tactical Speed to a Max of 5 hexes, and may fire at their Moving ROF');
            outputCard.body.push('For Firing: Teams must target an enemy within 4 hexes of the Team it will charge into');
            outputCard.body.push("Eligible Teams can complete the charge during the Assault Step");
            if (spotted === true) {
                outputCard.body.push("Teams that Called Artillery must remain Stationary and cannot Assault");
            }
        } 
        targetTeam.token.set("aura1_color",Colours.black);
        if (unitActivation === true) {
            unit.order = order;
            state.TY.currentUnitID = unit.id;
        }

        outputCard.body.push(extraLine);
        for (let i=0;i<targetArray.length;i++) {
            targetArray[i].order = order;
            targetArray[i].addCondition(order);
        }
        PrintCard();
    }

    const AddAbilities = (msg) => {
        if (!msg.selected) {
            sendChat("","No Token Selected");
            return;
        };
        let id = msg.selected[0]._id;
        let data = TokenCondition.LookUpMaster(id);
        if (data) {
            id = data.target;
        }

        let token = findObjs({_type:"graphic", id: id})[0];
        let char = getObj("character", token.get("represents"));

        let abilArray = findObjs({  _type: "ability", _characterid: char.id});
        //clear old abilities
        for(let a=0;a<abilArray.length;a++) {
            abilArray[a].remove();
        } 
        let team = TeamArray[id];
        if (!team) {return};

        let type = team.type;
        let special = team.special;

        if (special.includes("Passengers")) {
            abilityName = "Dismount Passengers";
            action = "!DismountPassengers";
            AddAbility(abilityName,action,char.id);     
        }

        if (type === "Aircraft") {
            abilityName = "Order Airstrike";
            action = "!EnterAircraft";
            AddAbility(abilityName,action,char.id);
        }

        if (char.get("name").includes("Mine") && type === "System Unit") {
            abilityName = "Minefield Check";
            action = "!MinefieldCheck;@{selected|token_id};@{target|token_id}";
            AddAbility(abilityName,action,char.id);
        }

        if (type !== "Aircraft") {
            if (type === "Infantry") {
                action = "!Activate;?{Order|Tactical|Dash|Hold|Assault}";
            } else if (type === "Gun") {
                if (team.tactical === 0) {
                    action = "!Activate;?{Order|Dash|Hold}";
                } else {
                    action = "!Activate;?{Order|Tactical|Dash|Hold}";
                }
            } else if (type === "Tank") {
                action = "!Activate;?{Order|Tactical|Dash|Hold|Assault}";
            } else if (type === "Unarmoured Tank") {
                action = "!Activate;?{Order|Tactical|Dash|Hold}";
            } else if (type === "Helicopter") {
                action = "!Activate;?{Order|Tactical|Hold}";
            }
            abilityName = "Order";
            AddAbility(abilityName,action,char.id);
        }

        let specOrders;
        if (type === "Infantry") {
             specOrders = "!SpecialOrders;?{Special Order|Blitz Move|Dig In|Follow Me|Shoot and Scoot|Clear Minefield"
        } else if (type === "Gun") {
            specOrders = "!SpecialOrders;?{Special Order|Dig In|Cross Here"
        } else if (type === "Tank") {
            specOrders = "!SpecialOrders;?{Special Order|Blitz Move|Cross Here|Follow Me|Shoot and Scoot";
            if (special.includes("Mine")) {
                specOrders += "|Clear Minefield";
            }
        } else if (type === "Unarmoured Tank") {
            specOrders = "!SpecialOrders;?{Special Order|Blitz Move|Cross Here|Follow Me|Shoot and Scoot";
        } else if (type === "Helicopter") {
            specOrders = "!SpecialOrders;?{Special Order|";
            if (special.includes("Passengers")) {
                specOrders += "Land/Take Off|";
            }
            specOrders += "Blitz Move|Shoot and Scoot";
        }
        specOrders += "}";

        if (type !== "Aircraft" && type !== "System Unit") {
            abilityName = "Special Order";
            AddAbility(abilityName,specOrders,char.id);
        }

        if (type === "Infantry") {
            abilityName = "Mount";
            AddAbility(abilityName,"!Mount;@{selected|token_id};@{target|Transport|token_id}",char.id);
        }

        if (team.cross > 1) {
            abilityName = "Cross";
            AddAbility(abilityName,"!Cross",char.id);
        }

        if (type === "Tank" || type === "Infantry") {
            abilityName = "Call Artillery";
            AddAbility(abilityName,"!CreateBarrages",char.id);
        }





        let types = {
            "Small Arms": [],
            "MG": [],
            "Flamethrower": [],
            "Gun": [],
            "Autocannon": [],
            "Handheld AT": [],
            "Vehicle Missile": [],
            "Artillery": [],
        }

        let smoke = false; //true if gun fires smoke
        for (let i=0;i<team.weaponArray.length;i++) {
            let weapon = team.weaponArray[i];
            if (weapon.type === " " || weapon.name === " ") {continue};
            if (weapon.notes.includes("Close Combat")) {continue};
            if (weapon.type.includes("MG")) {
                types["MG"].push(weapon.name);
            } else if (weapon.type === "Artillery" || weapon.type === "Rockets"){
                types["Artillery"].push(weapon.name);
            } else {
                types[weapon.type].push(weapon.name); 
            }
            if (weapon.notes.includes("Smoke")) {
                smoke = true;
            }
        }
        

        let weaponNum = 1;
        let weaponTypes = Object.keys(types);
        for (let i=0;i<weaponTypes.length;i++) {
            let weaponType = weaponTypes[i];
            let names = types[weaponType]
            if (names.length > 0) {
                if (weaponType === "MG" && names.length > 1) {
                    names = "MGs";
                }
                names = names.toString();
                if (names.charAt(0) === ",") {names = names.replace(",","")};
                names = names.replaceAll(",","+");
                if (weaponType === "Artillery") {
                    if (team.type === "Aircraft" || team.type === "Helicopter") {
                        AddAbility(weaponNum + ": " + names,"!CreateBarrages",char.id);
                    } else {
                        AddAbility("Preplan","!PlaceRangedIn",char.id);
                    }
                } else {
                    let shellType = "Regular";
                    if (type === "Gun" && smoke === true) {
                        shellType = "?{Fire Smoke|No,Regular|Yes,Smoke}";
                    }
                    abilityName = weaponNum + ": " + names;
                    action = "!Shooting;@{selected|token_id};@{target|token_id};" + weaponType + ";" + shellType;
                    AddAbility(abilityName,action,char.id);
                    weaponNum++;
                }
            }
        }


    }

    const AddAbility = (abilityName,action,charID) => {
        createObj("ability", {
            name: abilityName,
            characterid: charID,
            action: action,
            istokenaction: true,
        })
    }

    const Cross = (msg) => {
        if (!msg) {return}
        let id = msg.selected[0]._id;
        if (!id) {return};
        let team = TeamArray[id];
        SetupCard(team.name,"Cross",team.nation);
        let roll = randomInteger(6);
        let cross = team.cross;
        if (team.specialorder.includes("Cross Here")) {
            cross--;
        }
        if (state.TY.darkness === true) {
            cross++;
        }
        SetupCard(team.name,"vs. " + cross + "+",team.nation);
        outputCard.body.push("Roll: " + DisplayDice(roll,team.nation,24));
        if (roll >= cross) {
            outputCard.body.push("Success");
        } else {
            outputCard.body.push("Failure!<br>The Team stops where it is");
        }
//Leader Team Option to swap
        PrintCard();
    }

    const SpecialOrders = (msg) => {
        RemoveLines();
        let Tag = msg.content.split(";");
        let teamID = msg.selected[0]._id;
        let specialorder = Tag[1];
        let team = TeamArray[teamID];
        let unit = UnitArray[team.unitID];
        let unitLeader = TeamArray[unit.teamIDs[0]];
        SetupCard(unit.name,specialorder,team.nation);
        let errorMsg = [];

        let roll = randomInteger(6);
        let stat = 1;

        let targetTeam,targetName,noun;
        let targetArray = [];

        if (team.id !== unitLeader.id) {
            if (specialorder === "Clear Minefield" || specialorder === "Land/Take Off" || team.special.includes("HQ") || specialorder === "Dig In") {
                targetArray.push(team);
                targetTeam = team;
                targetName = team.name;
                noun = "Team";
            } else {
                errorMsg = "That Special Order must be issued by the Unit Leader";
            }
        } else {
            if (specialorder === "Clear Minefield") {
                targetArray.push(team);
                targetTeam = team;
                targetName = team.name;
                noun = "Team";
            } else {
                targetTeam = unitLeader;
                targetName = unit.name;
                noun = "Unit";
                _.forEach(unit.teamIDs,id => {
                    let tm = TeamArray[id];
                    if (tm.inCommand === true && tm.bailed === false && tm.queryCondition("Spot") === false) {
                        targetArray.push(tm);
                    }
                });
            }
        }

        if (targetTeam.specialorder !== "") {
            errorMsg.push("Teams can only have one Special Order per turn");
        }
        
        if (specialorder === "Blitz Move" || specialorder === "Dig In" || specialorder === "Clear Minefield" || specialorder === "Cross Here") {
            if (targetTeam.moved === true || state.TY.step === "Assault") {
                errorMsg.push(specialorder + " Order must be given before movement");
            }
        }
        if (specialorder === "Dig In") {
            if (targetTeam.queryCondition("Spot") === true && noun === "Team") {
                errorMsg.push("This Team Called in Artillery and so cannot Dig In");
            }
        }

        if (specialorder === "Shoot and Scoot") {
            if (targetTeam.moved === true) {
                errorMsg.push("Unit has Moved and so cannot be given a Shoot and Scoot Order");
            }
            if (state.TY.step  !== "Assault") {
                errorMsg.push("Issue this order in the Assault Step");
            }
        }

        if (targetTeam.fired === true && specialorder !== "Shoot and Scoot") {
            errorMsg.push(noun + " has Fired this turn, cannot be given that Order");
        }

        if (errorMsg.length > 0) {
            for (let i=0;i<errorMsg.length;i++) {
                outputCard.body.push(errorMsg[i]);
            }
            PrintCard();
            return;
        }
        let line = DisplayDice(roll,unitLeader.nation,24) + " vs. ";
        if (specialorder === "Cross Here" || specialorder === "Clear Minefield" || specialorder === "Land/Take Off") {
            line = "Auto";
        } else {
            if (specialorder === "Follow Me") {
                stat = unitLeader.motivation;
                line += stat + "+  ";
            } else {
                stat = unitLeader.skill;
                line += stat + "+  ";
            }
            if (roll >= stat) {
                line += " Success!";
            } else {
                line += " Failure!";
            }
        }
        
        let condition;
        outputCard.body.push(line);
        switch (specialorder) {
            case "Blitz Move":
                if (roll >= stat) {
                    outputCard.body.push("The Unit Leader and any Teams that are In Command may immediately Move up to 2 hexes");
                    outputCard.body.push("Teams may make a normal Tactical Move, but if Hold are not considered to have Moved and can shoot at a Halted ROF");
                } else {    
                    outputCard.body.push("Teams from the Unit cannot Dash and automatically suffer a +1 to hit penalty as if they had Moved Out of Command");
                    specialorder = "Failed Blitz";
                }
                break;
            case "Cross Here":
                outputCard.body.push("Any Teams (including the Unit Leader) from the Unit rolling to Cross Difficult Terrain within 3 hexes of where the Unit Leader crosses improve their chance of crossing safely, reducing the score they need to pass a Cross Test by 1.");
                break;
            case "Dig In":
                let line;
                if (roll >= stat) {
                    if (noun === "Team") {
                        line = "The Team Digs In"
                    } else {
                        line = "In Command Teams that did not Call Artillery Dig In";
                    } 
                    outputCard.body.push(line);
                    DigIn(targetArray);
                } else {
                    outputCard.body.push("The " + noun + " failed to Dig In");
                    specialorder = "Failed Dig In";
                }
                outputCard.body.push(noun + " can fire at a moving ROF");
                outputCard.body.push("If Teams do not Shoot or Assault, they are Gone to Ground");
                break;
            case "Follow Me":
                if (roll >= stat) {
                    outputCard.body.push("In Command Teams may immediately Move directly forward up to an additional 2 hexes, remaining In Command.")
                } else {
                    outputCard.body.push("Teams remain where they are")
                    specialorder = "Failed Follow Me";
                }
                outputCard.body.push("Teams may not fire");
                break;
            case "Shoot and Scoot":
                if (roll >= stat) {
                    outputCard.body.push("The Leader and any Teams that are In Command and did not Move in the Movement Step may immediately Move up to 2 hexes");
                } else {
                    outputCard.body.push("Teams remain where they are")
                }
                break;
            case "Clear Minefield":
                outputCard.body.push('The Team is ordered to clear a Minefield within 2 Hexes');
                outputCard.body.push("That Team counts as having Dashed, and cannot Shoot or Assault");
                outputCard.body.push("The Minefield can be removed immediately");
                outputCard.body.push("Other Teams may be given the same order");   
                condition = "Dash";
                targetTeam.moved = true;
                break;
            case "Land/Take Off":
                if (targetTeam.landed() === true) {
                    outputCard.body.push("The Helicopter(s) Take Off and may now move");
                    _.forEach(targetArray,team => {
                        team.removeCondition("Land/Take Off");
                    })
                } else {
                    outputCard.body.push('The Helicopter(s) land. They may not land within 4 hexes of an enemy team');
                    outputCard.body.push('Passengers may embark/disembark the following turn');
                    condition = "Land/Take Off";
                }
        }
        _.forEach(targetArray,team => {
            team.specialorder = specialorder;
            if (condition) {
                team.addCondition(condition);
            }
        })
        PrintCard();
    }

    const DigIn = (array) => {
        _.forEach(array,team => {
            if (team.token.get("layer") !== "walls" && (team.type === "Infantry" || team.type === "Gun")) {
                RemoveRangedInMarker(team.unitID);
                let hex = hexMap[team.hexLabel];
                if (hex.terrain.includes("Building") === false && hex.terrain.includes("Foxholes") === false && hex.terrain.includes("Offboard") === false) {
                    let dimensions = Math.max(team.token.get("height"), team.token.get("width")) + 25
                    let newToken = createObj("graphic", {   
                        left: team.location.x,
                        top: team.location.y,
                        width: dimensions, 
                        height: dimensions,
                        name: "Foxholes",  
                        rotation: 30,
                        isdrawing: true,
                        pageid: team.token.get("pageid"),
                        imgsrc: "https://s3.amazonaws.com/files.d20.io/images/253100240/1FOuKa7fU3YYi0Gf_Yz8DQ/thumb.png?1635623427",
                        layer: "map",
                        gmnotes: "GM"
                    });
                    toFront(newToken);
                    hexMap[team.hexLabel].terrain.push("Foxholes");
                    hexMap[team.hexLabel].foxholes = true;
                    let fInfo = {
                        hexLabel: team.hexLabel,
                        id: newToken.id, //id of the Foxholes token, can be used to remove later
                    }
                    FoxholeArray.push(fInfo);
                }
            }
        });
    }
    
    const RemoveFoxholes = () => {
        let newFoxholes = [];
        for (let i=0;i<FoxholeArray.length;i++) {
            let foxhole = FoxholeArray[i];
            if (hexMap[foxhole.hexLabel].teamIDs.length === 0) {
                let index = hexMap[foxhole.hexLabel].terrain.indexOf("Foxholes");
                if (index > -1) {
                    hexMap[foxhole.hexLabel].terrain.splice(index,1);
                    hexMap[foxhole.hexLabel].foxholes = false;
                }
                let tok = findObjs({_type:"graphic", id: foxhole.id})[0];
                if (tok) {
                    tok.remove();
                }
            } else {
                newFoxholes.push(foxhole);
            }
        }
        FoxholeArray = newFoxholes;
    }
    
    const ChangeStep = (msg) => {
        let Tag = msg.content.split(";");
        let newStep = Tag[1];
        state.TY.step = newStep;
        if (newStep === "Start") {
            RemoveMoveMarkers();
            if (state.TY.darkness === true) {
                pageInfo.page.set({
                    dynamic_lighting_enabled: true,
                    daylight_mode_enabled: true,
                    daylightModeOpacity: 0.1,
                })
            } else {
                pageInfo.page.set("dynamic_lighting_enabled",false);
            }
            StartStep("ResLeaders");
        }
        if (newStep === "Movement") {
            SetupCard("Turn: " + state.TY.turn,"Movement Step",playerNation);
            outputCard.body.push("Give Units Orders if Desired");
            outputCard.body.push("Move Any or All Units");
            outputCard.body.push("Other Player can Interrupt for Opportunity Fire");
            outputCard.body.push("Teams that don't move,shoot or assault are considered Gone to Ground");
            PrintCard();
        }
        if (newStep === "Shooting") {
            SetHexes(state.TY.currentPlayer);
            RemoveMoveMarkers();
            SetupCard("Turn: " + state.TY.turn,"Shooting Step",playerNation);
            outputCard.body.push("Anti-Aircraft Fire");
            outputCard.body.push("Direct Fire");
            outputCard.body.push("Bombardments");
            PrintCard();
        }
        if (newStep === "Assault") {
            RemoveBarrageToken();
            AssaultHexes = [];
            SetupCard("Turn: " + state.TY.turn,"Assault Step",playerNation);
            outputCard.body.push("Units that have Assault Orders can Charge Into Contact");
            outputCard.body.push("Then conduct Assaults");
            PrintCard();
        }
    }

    const Initiative = (step) => {
        let firstNation;
        let lastPlayer = state.TY.playerSteps[state.TY.playerSteps.length - 1] || 2;
        let secondLastPlayer = state.TY.playerSteps[state.TY.playerSteps.length - 2] || 3;
log(step)
log("LAst: " + lastPlayer)
log("2nd Last: " + secondLastPlayer)


        if (state.TY.gametype === "Meeting Engagement") {
            if (lastPlayer === secondLastPlayer && step !== "Assault") {
log("Same had 2")
                firstNation = (state.TY.nations[0][0] === lastPlayer) ? state.TY.nations[1][0]:state.TY.nations[0][0];
            } else {
                let roll = randomInteger(2) - 1;
                firstNation = state.TY.nations[roll][0];
            }
            if (step !== "Assault") {
                state.TY.playerSteps.push(firstNation);
            }
        } else {
            firstNation = "Neutral"; //fix
        }
        outputCard.body.push(DisplayDice(6,firstNation,36));
        outputCard.body.push(firstNation + " goes first");
    }






    const AdvanceStep = () => {
        RemoveLines();
        RemoveBarrageToken();
        if (state.TY.nations[0].length === 0 && state.TY.nations[1].length === 0) {
            sendChat("","No Units Created Yet");
            return;
        }
        let turn = state.TY.turn;
        let currentStep = state.TY.step;
        let steps = ["Start","Artillery and Air","Move and Fire","Assault"];

        if (turn === 0) {
            for (let p=0;p<2;p++) {
                let num = 100 + parseInt(p);
                let form = new Formation(state.TY.nations[p][0],num,"Barrages");
                let unit = new Unit(state.TY.nations[p][0],num,"Barrages",num);
            }
            if (state.TY.gametype === "") {
                SetupCard("Setup Game","","Neutral");
                ButtonInfo("Setup New Game","!SetupGame;?{Game Type|Meeting Engagement|Attack/Defend};?{Time of Day|Daylight|Dawn|Dusk|Night|Random}");
                PrintCard();
                return;
            }
            if (state.TY.gametype === "Meeting Engagement") {
                _.forEach(TeamArray,team => {
                    DigIn([team])
                })
                _.forEach(UnitArray,unit => {
                    GTG(unit);
                })
            }
            turn = 1;
            state.TY.turn = 1;
            currentStep = "Start";
            state.TY.step = "Start";
        } else {
            let num = steps.indexOf(currentStep) + 1;
            if (state.TY.gametype === "Meeting Engagement" && turn === 1 && num === 1) {
                num = 2; //skip artillery and air first turn
            }
            if (num >= steps.length) {
                num = 0;
                turn++;
                state.TY.turn = turn;
            }
            if (num === 3) {
                let keys = Object.keys(UnitArray);
                for (let i=0;i<keys.length;i++) {
                    let unit = UnitArray[keys[i]];
                    let unitLeader = TeamArray[unit.teamIDs[0]];
                    if (!unitLeader) {continue};
                    if (unitLeader.bailed === true) {
                        let text = SwapLeader(unit);
                        if (text !== "") {
                            sendChat("",text);
                        }
                    }
                    if ((hexMap[unitLeader.hexLabel].terrain.includes("Offboard") && unitLeader.type !== "Helicopter" && unit.inReserve === false) || unitLeader.token.get("aura1_color") === Colours.black || unitLeader.token.get("aura1_color") === Colours.lightpurple) {continue};
                    if (unitLeader.bailed === true) {continue};
                    let pos = unitLeader.location;
                    sendPing(pos.x,pos.y, Campaign().get('playerpageid'), null, true); 
                    SetupCard(unit.nation,"",unit.nation);
                    outputCard.body.push("Unit has not been activated");
                    PrintCard();
                    return;
                }
            }
            currentStep = steps[num];
            state.TY.step = currentStep;
        }


        if (currentStep === "Start") {       
            //Turn Marker
            let tmIDs = state.TY.turnMarkerIDs;
            for (let i=0;i<tmIDs.length;i++) {
                let tmID = tmIDs[i];
                let turnMarker = findObjs({_type:"graphic", id: tmID})[0];
                if (!turnMarker) {
                    PlaceTurnMarker(i);
                } else {
                    let newImg = getCleanImgSrc(TurnMarkers[state.TY.turn]);
                    turnMarker.set("imgsrc",newImg);
                }
            }

            //check if Time of Day Change
            if ((state.TY.timeOfDay === "Dawn" || state.TY.timeOfDay === "Dusk") && turn > 2) {
                let numDice = turn - 2;
                let flip = false;
                for (let i=0;i<numDice;i++) {
                    let roll = randomInteger(6);
                    if (roll > 4) {
                        flip = true;
                        break;
                    }
                }
                if (flip) {
                    SetupCard("Time Change","","Neutral");
                    if (state.TY.timeOfDay === "Dawn") {
                        outputCard.body.push("[#ff0000]Morning has broken, the rest of the battle is fought in Daylight[/#]");
                        state.TY.timeOfDay = "Daylight";
                        state.TY.darkness = false;
                        pageInfo.page.set("dynamic_lighting_enabled",false);
                    }
                    if (state.TY.timeOfDay === "Dusk") {
                        outputCard.body.push("[#ff0000]Night has fallen, the rest of the battle is fought in Darkness[/#]");
                        state.TY.timeOfDay = "Night";
                        state.TY.darkness = true;
                        state.TY.vision = randomInteger(6) + 2;
                        outputCard.body.push("Visibility is " + state.TY.vision + "hexes");
                        pageInfo.page.set({
                            dynamic_lighting_enabled: true,
                            daylight_mode_enabled: true,
                            daylightModeOpacity: 0.1,
                        })
                    }
                    PrintCard();
                }
            }
    
            if (state.TY.darkness === true) {
                pageInfo.page.set({
                    dynamic_lighting_enabled: true,
                    daylight_mode_enabled: true,
                    daylightModeOpacity: 0.1,
                })
            } else {
                pageInfo.page.set("dynamic_lighting_enabled",false);
            }

            StartStep("ResLeaders");
        }
        if (currentStep === "Artillery and Air") {
            SetupCard("Artillery and Air","Turn: " + state.TY.turn,"Neutral");
            outputCard.body.push("Players take turns Calling in Artillery and/or Airstrikes");
            outputCard.body.push("[hr]");
            Initiative(currentStep);
            PrintCard();
        }
        if (currentStep === "Move and Fire") {
            RemoveBarrageToken();
            SetupCard("Move and Fire","Turn: " + state.TY.turn,"Neutral");
            outputCard.body.push("Players take turns Activating Units to Move and Fire");
            outputCard.body.push("[hr]");
            Initiative(currentStep);
            PrintCard();
        }
        if (currentStep === "Assault") {
            if (state.TY.currentUnitID !== "") {
                let curUnit = UnitArray[state.TY.currentUnitID];
                if (curUnit) {
                    GTG(curUnit);
                    curUnit.IC();
                }
            }
            let assaultFlag = false;
            let keys = Object.keys(UnitArray);
            for (let i=0;i<keys.length;i++) {
                let unit = UnitArray[keys[i]];                
                if (unit.order === "Assault") {
                    assaultFlag = true;
                    break;
                }
            }
            RemoveBarrageToken();
            SetupCard("Assault","Turn: " + state.TY.turn,"Neutral");
            if (assaultFlag === false) {
                outputCard.body.push("No Assaults this turn");
                outputCard.body.push("Advance to Next Turn when ready");
            } else {
                outputCard.body.push("Players take turns conducting Assaults");
                outputCard.body.push("Defending Units may Defensive Fire if they have not fired this turn");
                outputCard.body.push("[hr]");
                Initiative(currentStep);
            }
            PrintCard();
        }
    }

    const StartStep = (pass) => {
        if (pass === "ResLeaders") {
            CheckArray = [];
            for (let p=0;p<2;p++) {
                //check if a formation HQ for the player is dead
                let formationIDs = deadHQs[p];
                for (let i=0;i<formationIDs.length;i++) {
                    let formation = FormationArray[formationIDs[i]];
                    if (formation) {
                        let eligibleUnitIDs = formation.unitIDs;
                        let team;
                        let possibleTeams = [];
                        for (let i=0;i<eligibleUnitIDs.length;i++) {
                            let unit = UnitArray[eligibleUnitIDs[i]];
                            let unitLeader = TeamArray[unit.teamIDs[0]];
                            if (unitLeader.special.includes("Passengers")) {continue};
                            if ((unit.teamIDs.length > (lastStandCount[unit.type] + 1)) || unit.teamIDs.length === 1) {
                                team = unitLeader;
                                break;
                            } else {
                                possibleTeams.push(unitLeader);
                            }
                        }
                        if (team === undefined && possibleTeams.length > 0) {
                            team = possibleTeams[0];
                        }
                        if (team !== undefined) {
                            CheckArray.push(team);
                        }
                    }
                }
            }

            if (CheckArray.length > 0) {
                SetupCard("Field Promotions","","Neutral");
                ButtonInfo("Start","!FieldPromotions");
                PrintCard();            
            } else {
                StartStep("Remount");
            }
        }
        if (pass === "Remount") {
            deadHQs = [[],[]];
            CheckArray = [];
            let keys = Object.keys(UnitArray); 
            for (let i=0;i<keys.length;i++) {
                let unit = UnitArray[keys[i]];
                if (unit.type !== "Tank") {continue};
                let ids = unit.teamIDs;
                for (let j=0;j<ids.length;j++) {
                    let team = TeamArray[ids[j]];
                    if (team.bailed === true) {
                        CheckArray.push(team);
                    }
                }
            }
            if (CheckArray.length > 0) {
                SetupCard("Remount Checks","","Neutral");
                ButtonInfo("Start Remount Checks","!RemountChecks");
                PrintCard();            
            } else {
                StartStep("Rally");
            }
        }
        if (pass === "Rally") {
            CheckArray = [];
            let keys = Object.keys(UnitArray);
            for (let i=0;i<keys.length;i++) {
                let unit = UnitArray[keys[i]];
                if ((unit.type !== "Infantry" && unit.type !== "Unarmoured Tank" && unit.type !== "Gun")) {continue};
                let unitLeader = TeamArray[unit.teamIDs[0]];
                if (!unitLeader) {
                    log("No Unit Leader for this unit: " + unit.name);
                    log("# of units: " + unit.teamIDs.length);
                    return;
                }
                unit.Size();
                unitLeader.token.set("bar3_value",0);
                if (unit.pinned() === true) {
                    CheckArray.push(unit);
                };
            };
            if (CheckArray.length > 0) {
                SetupCard("Rally Checks","","Neutral");
                ButtonInfo("Start Rally Checks","!RallyChecks");
                PrintCard();            
            } else {
                StartStep("Unit Morale");
            }
        }
        if (pass === "Unit Morale") {
            CheckArray = [];
            let keys = Object.keys(UnitArray);
            for (let i=0;i<keys.length;i++) {
                let unit = UnitArray[keys[i]];
                if (unit.name === "Barrages") {continue};
                let unitLeader = TeamArray[unit.teamIDs[0]];
                if (!unitLeader) {
                    log("Error in Unit Morale Unit Leader")
                    log(unit)
                    continue;
                }
                if ( unitLeader.special.includes("HQ") || unitLeader.token.get(SM.HQ) === true || unitLeader.special.includes("Independent")) {continue};
                let count = 0;
                let ids = unit.teamIDs;
                for (let j=0;j<ids.length;j++) {
                    let team = TeamArray[ids[j]];
                    if (team.type === "Tank") {
                        if (team.bailed === true) {
                            continue;
                        }
                    }
                    if (team.inCommand === true) {
                        count++;
                    }   
                }
                if (count < lastStandCount[unit.type]) {
                    CheckArray.push(unit);
                }
            }
            if (CheckArray.length > 0) {
                SetupCard("Unit Morale Checks","","Neutral");
                ButtonInfo("Start Morale Checks","!MoraleChecks");
                PrintCard();            
            } else {
                StartStep("Formation Morale");
            }
        }
        if (pass === "Formation Morale") {      
            let keys = Object.keys(FormationArray);
            for (let i=0;i<keys.length;i++) {
                let formation = FormationArray[keys[i]];
                if (formation.name === "Support" || formation.name === "Barrages") {continue};
                let unitNumbers = formation.unitIDs.length;
                if (unitNumbers < 2) {
                    SetupCard(formation.name,"Morale",formation.nation);
                    outputCard.body.push("The Formation as a whole breaks and flees the field!");
                    outputCard.body.push("Check Victory Conditions");
                    //destroy units/teams
                    PrintCard();
                }
            }
            StartStep("Final");
        }
        if (pass === "Final") {
            SetupCard("Turn: " + state.TY.turn,"Starting Step","Neutral");
            ClearSmoke("Smokescreens");
            RemoveFoxholes();
            if (state.TY.turn === 1 && state.TY.gametype === "Meeting Engagement") {
                outputCard.body.push("No Artillery or Airstrikes this Turn");
                outputCard.body.push("Helicopters must Loiter this turn");
                outputCard.body.push("All Teams start Gone to Ground and Concealed until they activate");
                outputCard.body.push("All Teams are treated as having moved in the Shooting Step");
            } else {
                outputCard.body.push("In Order:")
                outputCard.body.push("1 - Reveal/Place Ambushes");
                outputCard.body.push("2 - Roll for Reserves");
                outputCard.body.push("3 - Roll for Strike Aircraft");
            }
            PrintCard();
            _.forEach(UnitArray,unit => {
                unit.resetflags();
            });

            state.TY.currentUnitID = "";
        }
    }

    const GTG = (unit) => {
        let teamIDs = unit.teamIDs;
        for (let i=0;i<teamIDs.length;i++) {
            let team = TeamArray[teamIDs[i]];
            if (team.type === "System Unit" || team.type === "Aircraft") {continue};
            if (team.type === "Helicopter" && team.landed() === false && team.special.includes("Hunter-Killer") === false) {continue};
            let gtg = (team.moved === true || team.fired === true) ? false:true;

            let movexceptions = ["Hunter-Killer","Scout"];
            _.forEach(movexceptions,exception => {
                if (team.special.includes(exception) && team.fired === false) {gtg = true};
            })
            let fireexceptions = ["Swingfire","Hammerhead"];
            _.forEach(fireexceptions,exception => {
                if (team.special.includes(exception) && team.moved === false) {gtg = true};
            })

            if (gtg === false) {
                team.removeCondition("GTG")
                team.gonetoground = false;
                if (team.token.get("aura1_color") === Colours.lightpurple) {
                    team.token.set("aura1_color",Colours.black);
                }
            } else {
                team.addCondition("GTG")
                team.gonetoground = true;
                if (i===0 && state.TY.turn > 0) {
                    team.token.set("aura1_color",Colours.lightpurple)
                }
            }
        }
    }

    const FieldPromotions = () => {
        let team = CheckArray.shift();
        if (team) {
            let location = team.location;
            sendPing(location.x,location.y, Campaign().get('playerpageid'), null, true); 
            SetupCard(team.name,"Promote",team.nation);
            outputCard.body.push("Roll Against: 3+");
            ButtonInfo("Roll","!RollD6;Promote;" + team.id);
            PrintCard();
        } else {
            StartStep("Remount");
        }
    }

    const RemountChecks = () => {
        let team = CheckArray.shift();
        if (team) {
            let location = team.location;
            sendPing(location.x,location.y, Campaign().get('playerpageid'), null, true); 
            SetupCard(team.name,"Remount",team.nation);
            outputCard.body.push("Roll Against: " + team.remount);
            ButtonInfo("Roll","!RollD6;Remount;" + team.id + ";" + team.remount);
            PrintCard();
        } else {
            StartStep("Rally");
        }
    }
    
    const RallyChecks = () => {
        let unit = CheckArray.shift();
        if (unit) {
            SetupCard(unit.name,"Rally",unit.nation);
            let unitLeader = TeamArray[unit.teamIDs[0]];
            let location = unitLeader.location;
            let rally = unitLeader.rally;    
            sendPing(location.x,location.y, Campaign().get('playerpageid'), null, true); 
            outputCard.body.push("Roll Against: " + rally);
            ButtonInfo("Roll","!RollD6;Rally;" + unit.id + ";" + rally);
            PrintCard();
        } else {
            StartStep("Unit Morale");
         }
    }
    
    const MoraleChecks = () => {
        let unit = CheckArray.shift();
        if (unit) {
            SetupCard(unit.name,"Unit Morale",unit.nation);
            let unitLeader = TeamArray[unit.teamIDs[0]];
            let location = unitLeader.location;
            let morale = unitLeader.morale;
            sendPing(location.x,location.y, Campaign().get('playerpageid'), null, true); 
            outputCard.body.push("Roll Against: " + morale);
            ButtonInfo("Roll","!RollD6;UnitMorale;" + unit.id + ";" + morale);
            PrintCard();
        } else {
            StartStep("Formation Morale");
        }
    }
    
    const BreakOff = (msg) => {
        let defendingPlayer = msg.content.split(";")[1];
        SetupCard("Break Off","",state.TY.nations[defendingPlayer]);
        outputCard.body.push('Breaking Off Teams must move at Tactical speed the shortest distance to be further than 3 hexes away from all Assaulting Teams');
        outputCard.body.push("Any Teams not able to do so surrender and are destroyed");
        outputCard.body.push("The Winning Teams may Consolidate 2 hexes, this Move may not bring them into contact with an enemy team");
        PrintCard();
        AssaultIDs = [[],[]];
    }

    const RollD6 = (msg) => {
        let Tag = msg.content.split(";");
        PlaySound("Dice");
        let roll = randomInteger(6);
        if (Tag.length === 1) {
            let playerID = msg.playerid;
            let nation = "Neutral";
            if (!state.TY.players[playerID] || state.TY.players[playerID] === undefined) {
                if (msg.selected) {
                    let id = msg.selected[0]._id;
                    if (id) {
                        let tok = findObjs({_type:"graphic", id: id})[0];
                        let char = getObj("character", tok.get("represents")); 
                        nation = Attribute(char,"nation");
                        state.TY.players[playerID] = nation;
                    }
                } else {
                    sendChat("","Click on one of your tokens then select Roll again");
                    return;
                }
            } else {
                nation = state.TY.players[playerID];
            }
            let res = "/direct " + DisplayDice(roll,nation,40);
            sendChat("player|" + playerID,res);
        } else {
            let type = Tag[1];
            if (type === "Remount") {
                let id = Tag[2];
                let needed = parseInt(Tag[3]);
                let neededText = needed.toString() + "+";
                let team = TeamArray[id];
                if (team.special.includes("Passengers") && hexMap[team.hexLabel].terrain.includes("Offboard")) {
                    needed = 1;
                    neededText = "Auto"
                }
                let unit = UnitArray[team.unitID];
                let roll = randomInteger(6);
                let reroll = CommandReroll(team);
                SetupCard(team.name,"Needing: " + neededText,team.nation);
                outputCard.body.push("Team: " + DisplayDice(roll,team.nation,24));
                if (roll < needed && reroll > -1) {
                    outputCard.body.push("Commander Reroll: " + DisplayDice(reroll,team.nation,24));
                }
                if (roll >= needed || reroll >= needed) {
                    outputCard.body.push("Success!");
                    team.remountTank();
                } else {
                    outputCard.body.push("Failure! Team remains Bailed Out");
                }
                let part1 = "Done";
                if (CheckArray.length > 0) {
                    part1 = "Next Team";
                } 
                ButtonInfo(part1,"!RemountChecks");
                PrintCard();
            } else if (type === "Rally") {
                let unitID = Tag[2];
                let needed = parseInt(Tag[3]);
                let unit = UnitArray[unitID];
                let roll = randomInteger(6);
                let unitLeader = TeamArray[unit.teamIDs[0]];
                SetupCard(unit.name,"Needing: " + needed + "+",unit.nation);
                outputCard.body.push("Unit Leader: " + DisplayDice(roll,unit.nation,24));
                let reroll = CommandReroll(unitLeader);
                if (roll < needed && reroll > -1) {
                    outputCard.body.push("Commander Reroll: " + DisplayDice(reroll,unit.nation,24));
                }
                if (roll >= needed || reroll >= needed) {
                    outputCard.body.push("Success!");
                    unit.unpin();
                } else {
                    outputCard.body.push("Failure! Unit remains Pinned");
                }
                let part1 = "Done";
                if (CheckArray.length > 0) {
                    part1 = "Next Unit";
                } 
                ButtonInfo(part1,"!RallyChecks");
                PrintCard();
            } else if (type === "UnitMorale") {
                let unitID = Tag[2];
                let needed = parseInt(Tag[3]);
                let unit = UnitArray[unitID];
                let roll = randomInteger(6);
                let unitLeader = TeamArray[unit.teamIDs[0]];
                if (!unitLeader) {
                    log("ERROR with Unit Leader of unit: " + unit.name)
                    return;
                }
                SetupCard(unit.name,"Needing: " + needed + "+",unit.nation);
                outputCard.body.push("Unit Leader: " + DisplayDice(roll,unit.nation,24));
                let reroll = CommandReroll(unitLeader);
                if (roll < needed && reroll > -1) {
                    outputCard.body.push("Commander Reroll: " + DisplayDice(reroll,unit.nation,24));
                }
                if (roll >= needed || reroll >= needed) {
                    outputCard.body.push("Success!");
                    outputCard.body.push("Unit continues to fight.");
                } else {
                    outputCard.body.push("Failure! Unit Flees the Field!");
                    outputCard.body.push("(Any associated Transports Should be Removed)");
/*
                    FormationArray[unit.formationID].remove(unit);
                    for (let i=0;i<unit.teamIDs;i++) {
                        let id = unit.teamIDs[i];
                        TeamArray[id].Kill();
                    }
*/

                }
                let part1 = "Done";
                if (CheckArray.length > 0) {
                    part1 = "Next Unit";
                } 
                ButtonInfo(part1,"!MoraleChecks");
                PrintCard();
            } else if (type === "Promote") {
                let id = Tag[2];
                let team = TeamArray[id]
                let roll = randomInteger(6);
                SetupCard(team.name,"Needing: 3+",team.nation);
                outputCard.body.push("Roll: " + DisplayDice(roll,team.nation,24));
                if (roll < 3) {
                    outputCard.body.push("Failure!");
                    outputCard.body.push("The Formation now lacks an HQ for the remainder of the Battle");
                } else {
                    outputCard.body.push("Success!");
                    outputCard.body.push(team.name + " assumes Command");
                    outputCard.body.push("He leaves his current Unit to form an HQ unit");
                    outputCard.body.push("Promoted Leaders cannot Spot");
                    let originalUnit = UnitArray[team.unitID];
                    originalUnit.remove(team);
                    let newUnit = new Unit(team.nation,stringGen(),"Promoted HQ",team.formationID);
                    newUnit.add(team);
                    let r = 0.1;
                    if (team.type === "Infantry") {r = 0.25};
                    let name = PromotedName(team);
                    team.token.set({
                        name: name,
                        tint_color: "transparent",
                        aura1_color: Colours.green,
                        aura1_radius: r,
                        showname: true,
                        statusmarkers: "",
                    })                    
                    team.name = name;
                    newUnit.hqUnit = true;
                    newUnit.size = 1;
                    team.token.set(SM.HQ,true);
                }
                let part1 = "Done";
                if (CheckArray.length > 0) {
                    part1 = "Next Formation";
                }
                ButtonInfo(part1,"!FieldPromotions");
                PrintCard();
            } else if (type === "Counterattack") {
                let defUnitIDs = [];
                for (let i=2;i<Tag.length - 1;i++) {
                    defUnitIDs.push(Tag[i]);
                }
                let defendingPlayer = UnitArray[defUnitIDs[0]].player;
                SetupCard("Counterattack","",state.TY.nations[defendingPlayer][0]);
                let round = parseInt(Tag[Tag.length-1]) + 1;
                let roll = randomInteger(6);
                let counterAttackingUnitIDs = [];
                let counterAttackingTeamIDs = [];
                let breakingOffUnitIDs = [];
                _.forEach(defUnitIDs,unitID => {
                    let unit = UnitArray[unitID];
                    let defendingPlayer = unit.player;
                    outputCard.body.push("[U]" + unit.name + "[/u]");
                    let unitLeader = TeamArray[unit.teamIDs[0]];
                    let needed = unitLeader.counterattack;
                    let reroll = CommandReroll(unitLeader);
                    let line = "Roll: " + DisplayDice(roll,unit.nation,24);
                    if (reroll > 0) {
                        line += " / Reroll: " + DisplayDice(reroll,unit.nation,24);
                    }
                    roll = Math.max(roll,reroll);
                    if (roll < needed) {
                        outputCard.body.push("Unit must break off");
                        breakingOffUnitIDs.push(unit.id);
                    } else {
                        outputCard.body.push("Unit may Counterattack");
                        unit.order = "Assault";
                        _.forEach(unit.teamIDs,id => {
                            let team = TeamArray[id];
                            counterAttackingTeamIDs.push(team.id);
                            team.addCondition("Assault");
                            team.order = "Assault";
                        })
                        counterAttackingUnitIDs.push(unitID);
                    }
                });
                if (breakingOffUnitIDs.length > 0) {
                    outputCard.body.push('Breaking Off Teams must move at Tactical speed the shortest distance to be further than 3 hexes away from all Assaulting Teams');
                    outputCard.body.push("Any Teams not able to do so surrender and are destroyed");
                    _.forEach(breakingOffUnitIDs,unitID => {
                        let unit = UnitArray[unitID];
                        let teamIDs = DeepCopy(unit.teamIDs)
                        _.forEach(teamIDs,teamID => {
                            let team = TeamArray[teamID];
                            if (team.bailed === true) {
                                team.kill();
                            }
                        });
                    });
                }
                if (counterAttackingUnitIDs.length === 0) {
                    outputCard.body.push("The Assault is Over");
                    outputCard.body.push("The Winning Teams may Consolidate 2 hexes, this Move may not bring them into contact with an enemy team");
                } else {
                    outputCard.body.push("Counterattacking Teams not in contact may charge (if possible)");
                    outputCard.body.push("Once Set, click Button");
                    //revise AssaultIDs, button will start CCTwo with defending player now the attacker
                    AssaultIDs[defendingPlayer] = counterAttackingTeamIDs;
                    ButtonInfo("Start Next Round of Close Combat","!CloseCombatTwo;" + defendingPlayer +";" + round);
                }
                PrintCard();
            }
        }
    }

    const CommandReroll = (team) => {
        //will be unitLeader if pinning, counterattack
        //else will be an individual tank team if remounting
        let reroll = -1;
        let formation = FormationArray[team.formationID];
        let formationLeaders = [];
        if (formation.name !== "Support") {
            for (let i=0;i<formation.unitIDs.length;i++) {
                let unit = UnitArray[formation.unitIDs[i]];
                if (unit.hqUnit === true) {
                    let leader = TeamArray[unit.teamIDs[0]];
                    formationLeaders.push(leader);
                }
            }
        } else {
            let keys = Object.keys(UnitArray);
            for (let i=0;i<keys.length;i++) {
                let unit = UnitArray[keys[i]];
                if (unit.hqUnit === true && unit.player === team.player) {
                    let leader = TeamArray[unit.teamIDs[0]];
                    formationLeaders.push(leader);
                }
            }
        }
        for (let i=0;i<formationLeaders.length;i++) {
            let leader = formationLeaders[i];
            let checkID = leader.id;
            let losCheck = LOS(team.id,checkID);
            if (losCheck.los === true && losCheck.distance <= 8) {
                reroll = randomInteger(6);
                break;
            }
        }
        return reroll;
    }

    const Shooting = (msg) => {
        let Tag = msg.content.split(";");
        let shooterID = Tag[1];
        let targetID = Tag[2];
        let weaponType = Tag[3]; 
        let shellType = Tag[4]; //Regular,Smoke
        ShootingTwo(shooterID,targetID,weaponType,shellType);
    }

    const ShootingTwo = (shooterID,targetID,weaponType,shellType,observerID) => {
        let shooter = TeamArray[shooterID];
        let shooterUnit = UnitArray[shooter.unitID];
        let unitFire = false;
        let sname = shooter.name;

        let target = TeamArray[targetID];
        let targetUnit = UnitArray[target.unitID];
        
        if (shooterID === shooterUnit.teamIDs[0]) {
            unitFire = true
            sname = shooterUnit.name;
        } 

        SetupCard(sname,"Shooting",shooter.nation);

        let errorMsg = "";
        let defensive = false;
        let oppfire = false;
        if (hexMap[target.hexLabel].terrain.includes("Offboard")) {
            errorMsg = "Offboard Targets are not Eligible Targets";
        }

        if (shooterUnit.id !== state.TY.currentUnitID) {
            oppfire = true;
            if (state.TY.step === "Assault") {
                defensive = true;
                oppfire = false;
            }
        }
        let shootingType = (defensive === true) ? "Defensive":"Normal";

        if (shooter.order === "Dash") {
            errorMsg = 'Team Dashed and cannot Fire'
        }
        if (shooter.specialorder.includes("Follow Me")) {
            errorMsg = "Follow Me Special Order, Cannot Fire";
        }

        if (errorMsg !== "") {
            outputCard.body.push(errorMsg);
            PrintCard();
            return;
        }

        let weapons = [];
        let shooterTeamArray = [];
        let targetTeamArray = BuildTargetTeamArray(target,shooter);

        let mistaken = true;
        if ((shooter.hex.distance(target.hex) <= 8 && target.type.includes("Tank")) || shooter.hex.distance(target.hex) <= 4) {
            mistaken = false;
        }
        if (defensive === true) {mistaken = false};
log("Mistaken: " + mistaken)

        let limited = parseInt(shooterUnit.limited);
        let exclusions = [];

        for (let i=0;i<shooterUnit.teamIDs.length;i++) {
            let excluded;
            let st = TeamArray[shooterUnit.teamIDs[i]];
            if (unitFire === false && shooterID !== st.id) {continue}; //single team firing
            if (st.inCommand === false && unitFire === true) {continue};
            if (st.fired === true) {
                excluded = " Fired Already";
            }
            if (st.aaFired === true) {
                excluded = " Fired AA";
            }
            if (st.order === "Dash") {
                excluded = " Dashed";
            }
            if (st.specialorder === "Clear Minefield") {
                excluded = " is clearing Mines";
            }
            if (st.spotAttempts > 0) {
                excluded = " Spotted for Artillery";
            }
            if (st.type === "Tank" && st.bailed === true) {
                excluded = " is Bailed Out";
            }
            if (excluded === undefined) {
                let weaponExclusion;
                let flag = false;

                for (let j=0;j<st.weaponArray.length;j++) {
                    let weapon = st.weaponArray[j];
                    let special = "";
                    if (weaponType === "MG" && weapon.type.includes("MG") === false) {
                        continue;
                    } else if (weaponType !== "MG" && weapon.type !== weaponType) {
                        continue;
                    };
                    if (weapon.notes.includes("Limited")) {
                        let num;
                        let wn = weapon.notes.split(";");
                        for (let i=0;i<wn.length;i++) {
                            if (wn[i].includes("Limited")) {
                                num = wn[i].replace(/[^0-9]+/g, "");
                                break;
                            }
                        }
                        if (limited >= num) {
                            continue;
                        } else (limited++);
                    }
                    if (weapon.notes.includes("Mounted") && state.TY.passengers[st.id]) {
                        //check if passenger has weapon with name eg Dragon
                        let check = false;
                        let substrings = weapon.name.split(" ");
                        let passengers = state.TY.passengers[st.id];
                        ploop1:
                        for (let p=0;p<passengers.length;p++) {
                            let passengerTeam = TeamArray[passengers[p]];
                            for (let w=0;w<passengerTeam.weaponArray.length;w++) {
                                let wnam = passengerTeam.weaponArray[w].name;
                                for (let s=0;s<substrings.length;s++) {
                                    if (wnam.includes(substrings[s])) {
                                        check = true;
                                        break ploop1;
                                    }
                                }
                            }
                        }
                        if (check === false) {continue};
                    }

                    if (weapon.notes.includes("Overhead")) {special += ",Overhead"};
                    if (weapon.notes.includes("NLOS")) {special += ",NLOS"};
        
                    let initialLOS,tID;
                    let sID = (!observerID) ? st.id:observerID;
                    for (let t=0;t<targetTeamArray.length;t++) {
                        tID = targetTeamArray[t].id;
                        initialLOS = LOS(sID,tID,special);
                        if (initialLOS.los === true) {
                            break;
                        }
                    }

                    if (target.type === "Aircraft" && weapon.notes.includes("Guided AA") === false && weapon.notes.includes("Dedicated AA") === false && weapon.type !== "AA MG") {
                        weaponExclusion = " cannot fire at Aircraft";
                    }
                    
                    if (target.type === "Helicopter" && target.landed() === false) {
                        if (st.type === "Aircraft" && weapon.notes.includes("Anti-Helicopter") === false) {
                            weaponExclusion = " cannot fire at Helicopters";
                        }
                        if (st.type === "Infantry" && (st.special.includes("Heavy Weapon") || weapon.notes.includes("Heavy"))) {
                            if (weapon.notes.includes("Guided") === false && weapon.notes.includes("Dedicated AA") === false && weapon.type !== "AA MG" && weapon.notes.includes("Anti-Helicopter") === false) {
                                weaponExclusion = " cannot fire at Helicopters";
                            }
                        }
                        if (st.type.includes("Tank") || st.type.includes("Gun")) {
                            if (weapon.notes.includes("Guided") === false && weapon.notes.includes("Dedicated AA") === false && weapon.notes.includes("Anti-Helicopter") === false && weapon.type !== "AA MG") {}
                            weaponExclusion = " cannot fire at Helicopters";
                        }
                    }

                    if (initialLOS.los === false) {
                        weaponExclusion = " has no LOS to Target(s)";
                    }

                    if (weapon.notes.includes("Guided AA") && target.type !== "Aircraft" && target.type !== "Helicopter") {
                        weaponExclusion = " Guided AA can only target Aircraft and Helicopters";
                    }

                    if (weapon.minRange > initialLOS.distance || weapon.maxRange < initialLOS.distance) {
                        weaponExclusion = " is Not In Range";
                    };
                    if (weapon.notes.includes("Forward Firing") && initialLOS.shooterface !== "Front") {
                        weaponExclusion = " is Out of Arc";
                    };
                    if (st.type === "Helicopter" && st.landed() === true && weapon.notes.includes("Door Guns") === false) {
                        weaponExclusion = " is unable to fire while landed";
                    }

                    if (weaponExclusion === undefined) {
                        weapons.push(weapon);
                        let eta = {
                            targetName: TeamArray[tID].name,
                            targetID: tID,
                            los: initialLOS,
                            rangeFromInitial: 0,
                        }
                        st.eta = [eta];
                        shooterTeamArray.push(st);
                        flag = true;
                        if (weapon.type !== "AA MG") {
                            let phi = Angle(st.hex.angle(TeamArray[tID].hex));
                            st.token.set("rotation",phi);
                        }
                    } 
                }

                if (weaponExclusion !== undefined && flag === false) {
                    excluded = weaponExclusion;
                }
            }
            if (excluded !== undefined) {
                exclusions.push(st.name + excluded);
            }
        }

        shooterTeamArray = [...new Set(shooterTeamArray)];

        if (exclusions.length > 0) {
            for (let i=0;i<exclusions.length;i++) {
                outputCard.body.push(exclusions[i]);
            }
        }

        if (shooterTeamArray.length === 0) {
            PrintCard();
            return;
        }

        weapons = Unique(weapons,"name");
        let wnames = "";
        for (let i=0;i<weapons.length;i++) {
            if (i>0) {wnames += ", "}
            wnames += weapons[i].name;
        }

        outputCard.body.push(wnames);
        outputCard.body.push("[hr]");

        //expand ETA
        for (let i=0;i<shooterTeamArray.length;i++) {
            let st = shooterTeamArray[i];
            let sID = (!observerID) ? st.id:observerID;

            for (let j=0;j<targetTeamArray.length;j++) {
                let tt = TeamArray[targetTeamArray[j].id];
                if (defensive === true && st.ccIDs.includes(tt.id) === false) {
                    continue;
                }
                if (tt.id === st.eta[0].targetID) {continue} //already in ETA and checked
                let weaponFlag = false;
                let ttLOS;
                for (let k=0;k<weapons.length;k++) {
                    let weapon = weapons[k];
                    let special = " ";
                    if (weapon.notes.includes("Overhead")) {special += ",Overhead"};
                    if (weapon.notes.includes("NLOS")) {special += ",NLOS"};
                    if (defensive === true) {special += ",Defensive"};
                    ttLOS = LOS(sID,tt.id,special);
                    if (ttLOS.los === false) {continue};
                    if (ttLOS.distance > weapon.maxRange) {continue};
                    if (ttLOS.distance < weapon.minRange) {continue};
                    if (weapon.notes.includes("Forward Firing") && ttLOS.shooterface !== "Front") {continue};
                    weaponFlag = true;
                    break; //has one weapon with range and in arc
                }
                if (weaponFlag === false) {continue};
                let rfi = tt.hex.distance(target.hex);
                let eta = {
                    targetName: tt.name,
                    targetID: tt.id,
                    los: ttLOS,
                    rangeFromInitial: rfi,
                }
                st.eta.push(eta);
            }

            //reorder the eta based on distance from initial target
            st.eta = st.eta.sort(function(a,b) {
                return a.rangeFromInitial - b.rangeFromInitial;
            });
        }
log("# Shooters: " + shooterTeamArray.length)

log(weapons)
        let totalHits = 0;        

        for (let i=0;i<shooterTeamArray.length;i++) {
            let sTeam = shooterTeamArray[i];
            let moved = sTeam.moved;
            let eta = sTeam.eta;
            for (let j=0;j<weapons.length;j++) {
                let weapon = weapons[j];
                let toHit = parseInt(target.hit);
                let toHitTips = "<br>Base: " + toHit;
                let los = eta[0].los;
                let excl = false;

                if (weapon.notes.includes("Laser Rangefinder") || weapon.notes.includes("Guided") || (weapon.notes.includes("Accurate") && sTeam.moved === false) || weapon.notes.includes("NLOS")) {
                    excl = true;
                }
                if (weapon.notes.includes("Radar") && (target.type === "Aircraft" || (target.type === "Helicopter" && target.landed() === false))) {
                    excl = true;
                }

                if (los.distance > 16) {
                    toHit++;
                    toHitTips += "<br>Long Range +1";
                }

                if (state.TY.turn === 1 && target.gonetoground === true) {
                    los.concealed = true;
                }

                if (los.concealed === true) {
                    toHit++;
                    toHitTips += "<br>Concealed +1";
                    if (target.gonetoground === true) {
                        toHit++;
                        toHitTips += "<br>Gone to Ground +1";
                    } 
                }

                if (los.smoke === true && sTeam.special.includes("Thermal Imaging") === false) {
                    toHit++;
                    toHitTips += "<br>Smoke +1";
                }
                if (sTeam.inCommand === false) {
                    toHit++;
                    toHitTips += "<br>Not in Command +1";
                }
                if (state.TY.darkness === true && sTeam.special.includes("Thermal Imaging") === false) {
                    toHitTips += "<br>Darkness +1";
                    toHit++;
                }
                if (sTeam.specialorder === "Failed Blitz") {
                    toHit++;
                    toHitTips += "<br>Failed Blitz";
                }
                if (weapon.notes.includes("No HE") && (target.type === "Infantry" || target.type === "Gun")) {
                    toHit++;
                    toHitTips += "<br>No HE +1";
                }
                if (sTeam.special.includes("Overworked") && moved === true) {
                    toHit++;
                    toHitTips += "<br>Overworked & Moved +1";
                }
                if (sTeam.special.includes("Overworked") && oppfire === true) {
                    toHit++;
                    toHitTips += "<br>Overworked & Opp Fire +1";
                }
                if (weapon.notes.includes("Slow Firing") && moved === true) {
                    toHit++;
                    toHitTips += "<br>Slow Firing & Moved +1";
                }
                if (weapon.notes.includes("Slow Firing") && oppfire === true) {
                    toHit++;
                    toHitTips += "<br>Slow Firing & Opp Fire +1";
                }
                if (weapon.notes.includes("Stabiliser") && weapon.notes.includes("Advanced Stabiliser") === false && sTeam.maxTact === true) {
                    toHit++;
                    toHitTips += "<br>Stabiliser Used +1";
                }

                let rof = weapon.halted;
                if (sTeam.moved === true) {
                    rof = weapon.moving;
                }
                if (shooterUnit.pinned() === true) {
                    if (weapon.notes.includes("Pinned ROF")) {
                        let substring = weapon.notes.split(",");
                        substring = substring.filter((string) => string.includes("Pinned ROF"));
                        substring= substring.toString();
                        rof = parseInt(substring.replace(/[^0-9]+/g, ""));
                    } else {
                        rof = weapon.moving;
                    }
                }

                if (oppfire === true && target.type !== "Aircraft" && target.type !== "Helicopter") {
                    rof = weapon.moving;
                }

                if (target.type === "Aircraft") {
                    //allowable weapons should be screened out above
                    if (weapon.type === "AA MG" && weapon.notes.includes("Dedicated AA") === false) {
                        if (rof === 1) {
                            toHit += 1;
                            toHitTips.push("+1 as ROF 1 Weapon vs. Air");
                        } else {
                            rof = 1;                        
                        }
                    }   
                    if (weapon.notes.includes("Dedicated AA") || weapon.notes.includes("Guided AA")) {
                        rof = weapon.halted;
                    }
                    if (weapon.notes.includes("Manual Tracking")) {
                        toHit += 1;
                        toHitTips.push("Manual Tracking +1 vs Air");
                    }
                }
                if (target.type === "Helicopter" && target.landed() === false) {
                    //allowable weapons should be screened out above
                    if ((weapon.type === "AA MG" && weapon.notes.includes("Dedicated AA") === false) || sTeam.type === "Infantry" || (weapon.notes.includes("Guided") && weapon.notes.includes("Guided AA") === false) || (weapon.notes.includes("Anti-Helicopter") && sTeam.type !== "Aircraft")) {
                        if (rof === 1) {
                            toHit += 1;
                            toHitTips.push("+1 as ROF 1 Weapon vs. Air");
                        } else {
                            rof = 1;                        
                        }
                    }   
                    if (weapon.notes.includes("Dedicated AA") || weapon.notes.includes("Guided AA")) {
                        rof = weapon.halted;
                    }
                }

                if (toHitTips.length === 0) {
                    toHitTips = "No Modifiers";
                }

                if (rof === 0) {
                    continue;
                }

                let hp = parseInt(sTeam.token.get("bar1_value")) || 1;
                let hpMax = parseInt(sTeam.token.get("bar1_max")) || 1;
                if (hp/hpMax !== 1) {
                    let newROF = (hp * rof)/hpMax;
                    if (newROF < 1) {
                        rof = 1;
                        toHit++;
                        toHitTips.push("+1 due to Casualties");
                    } else {
                        rof = Math.round(newROF);
                    }
                }

                let rolls = [];
                let hits = 0;
                for (let k=0;k<rof;k++) {
                    let roll = randomInteger(6);
                    let roll2 = randomInteger(6);
                    if (roll >= toHit) {
                        rolls.push(roll);
                        hits++;
                    } else if (toHit > 6 && toHit < 9 && roll === 6) {
                        rolls.push(roll + "/" + roll2);
                        if (toHit === 7 && roll2 > 4) {
                            hits++;
                        } else if (toHit === 8 && roll2 === 6) {
                            hits++;
                        }
                    } else {
                        rolls.push(roll);
                    }
                }

                rolls.sort();
                rolls.reverse();

                rolls = rolls.toString() + " vs. " + toHit + "+";

                totalHits += hits;
                let end;
                if (hits === 0) {
                    if (rof === 1) {
                        end = "1 Shot which Missed";
                    } else {
                        end = "Missed with " + rof + " Shots";
                    }
                } else if (rof > 1) {
                    let noun = " Hit";
                    if (hits > 1) {noun += "s"};
                    end = hits + noun + " from " + rof + " Shots";
                    if (shellType === "Smoke") {
                        end = "Smoked a Target";
                    }
                } else {
                    end = "1 Shot which Hit";
                    if (shellType === "Smoke") {
                        end = "Smoked a Target";
                    }
                }
    
                if (hits > 0) {
                    end = "[#ff0000]" + end + "[/#]";       
                }

                let line = '[🎲](#" class="showtip" title="Rolls: ' + rolls + toHitTips + ')' + sTeam.name + ": " + end;
                outputCard.body.push(line);
                PlaySound(weapon.type);
                //FX
                if (weapon.notes.includes("Limited")) {
                    shooterUnit.limited++;
                }

                //assign hits
                for (let q=0;q<hits;q++) {
    log("Hit " + (q+1))
                    let targNum = 0;
                    for (let t=0;t<(eta.length - 1);t++) {
                        let t1 = TeamArray[eta[t].targetID];
                        let num1 = t1.hitArray.length;
                        let t2 = TeamArray[eta[t+1].targetID];
                        let num2 = t2.hitArray.length;
    log("Target " + t + ": " + t1.name + " Hits: " + num1);
    log("Target " + (t+1) + ": " + t2.name + " Hits: " + num2);
                        if (num2 < num1) {
                            targNum = (t+1);
                            break;
                        }
                    }
    log("Assigned to " + TeamArray[eta[targNum].targetID].name);
                    if (shellType === "Smoke") {
                        weapon.name = "Smoke";
                    }
                    let hit = {
                        weapon: weapon,
                        bp: eta[targNum].los.bulletproof,
                        facing: eta[targNum].los.facing,
                        range: eta[targNum].los.distance,
                        shooterID: sTeam.id,
                        shooterType: sTeam.type,
                        rangedIn: false,
                        closeCombat: false,
                        special: eta[targNum].los.special,
                    }
                    TeamArray[eta[targNum].targetID].hitArray.push(hit);
  


                }
            }
            //place markers on shooter
            /*
            sTeam.addCondition("Fired");
            if (sTeam.token.get("aura1_color") === Colours.lightpurple) {
                sTeam.token.set("aura1_color",Colours.black);
            }
            sTeam.fired = true;
            */
            if (sTeam.token.get("aura1_color") === Colours.lightpurple) {
                sTeam.token.set("aura1_color",Colours.black);
            }
            if (target.type === "Aircraft") {
                sTeam.addCondition("AAFire");
                sTeam.aaFired = true;
                sTeam.fired = true;
            } else {
                sTeam.addCondition("Fired");
                sTeam.fired = true;
            }
            
            if (state.TY.darkness === true) {
                sTeam.addCondition("Flare");
            }

        } //end shooter(s)

        for (let i=0;i<targetTeamArray.length;i++) {
            let tt = TeamArray[targetTeamArray[i].id];
            if (!unitIDs4Saves[tt.unitID]) {
                unitIDs4Saves[tt.unitID] = mistaken
            } 
        }

        //total hits
        outputCard.body.push("[hr]");
        outputCard.body.push("Total Hits: " + totalHits);

        let allFired = true;
        for (let i=0;i<shooterUnit.teamIDs.length;i++) {
            let team = TeamArray[shooterUnit.teamIDs[i]];
            if (team.fired === false && team.aaFired === false && team.bailed === false) {
                allFired = false;
                break;
            }
        }

        if (allFired === false) {
            outputCard.body.push("[hr]");
            outputCard.body.push("Not all Teams have fired");
            ButtonInfo("End Unit Fire","!EndFire;" + shootingType);
        }    
        PrintCard();
        if (allFired === true) {
            ProcessSaves(shootingType);
        } 
    }

    const CompareHits = (ta1,ta2) => {
        let hitInfo = {
            hits1: {
                swappable: [],
                unswappable: [],
            },
            hits2: {
                swappable: [],
                unswappable: [],
            }
        }
        for (let i=0;i<TeamArray[ta1.id].hitArray.length;i++) {
            let hit = TeamArray[ta1.id].hitArray[i];
            if (ta2.shooterIDs.includes(hit.shooterID) && hit.weapon.name !== "Smoke") {
                let newLOS = LOS(hit.shooterID,ta2.id,hit.special);
                hit.bp = newLOS.bp;
                hit.facing = newLOS.facing;
                hit.distance = newLOS.distance;
                hitInfo.hits1.swappable.push(hit);
            } else {
                hitInfo.hits1.unswappable.push(hit);
            }
        }
        for (let i=0;i<TeamArray[ta2.id].hitArray.length;i++) {
            let hit = TeamArray[ta2.id].hitArray[i];
            if (ta1.shooterIDs.includes(hit.shooterID) && hit.weapon.name !== "Smoke") {
                let newLOS = LOS(hit.shooterID,ta1.id,hit.special);
                hit.bp = newLOS.bp;
                hit.facing = newLOS.facing;
                hit.distance = newLOS.distance;
                hitInfo.hits2.swappable.push(hit);
            } else {
                hitInfo.hits2.unswappable.push(hit);
            }
        }
        return hitInfo;
    }

    const BuildTargetTeamArray = (targetTeam,shooterTeam) => {
        let array = [];
        let shooterUnit = UnitArray[shooterTeam.unitID];
        let targetUnit = UnitArray[targetTeam.unitID];
        let ids = targetUnit.teamIDs;

        //if HQ or independent, can add nearby formation in
        if (targetTeam.special.includes("HQ") || targetTeam.special.includes("Independent") || targetTeam.token.get(SM.HQ) === true) {
            let keys = Object.keys(UnitArray);
            btaLoop1:
            for (let j=0;j<keys.length;j++) {
                let unit = UnitArray[keys[j]];
                if (unit.id === targetUnit.id || unit.player !== targetUnit.player || unit.type !== targetUnit.type) {continue};
                for (let k=0;k<unit.teamIDs.length;k++) {
                    let team3 = TeamArray[unit.teamIDs[k]];
                    if (team3.hex.distance(targetTeam.hex) <= 6) {
                        //a valid team - add its unit IDs, rest will get sorted in/out below
                        ids = ids.concat(unit.teamIDs);
                        targetUnit.linkedUnitID = unit.id;
                        break btaLoop1;
                    }
                }
            }
        }

        for (let i=0;i<ids.length;i++) {
            let team = TeamArray[ids[i]];
            let refDistance = targetTeam.hex.distance(team.hex);//distance from targeted team to this team
            if (refDistance > 6 || team.type !== targetTeam.type) {continue}; //too far or not same type
            if (team.token.get("layer") === "walls") {continue}; //is a passenger
            if (shooterTeam.type === "Aircraft") {
                let keys = Object.keys(TeamArray);
                for (let k=0;k<keys.length;k++) {
                    let team3 = TeamArray[keys[k]];
                    if (team3.player === shooterTeam.player) {
                        if (team.hex.distance(team3.hex) < 4) {
                            continue; //Safety Distance
                        }
                    }
                }
            }

            for (let j=0;j<shooterUnit.teamIDs.length;j++) {
                let ttLOS = LOS(team.id,shooterUnit.teamIDs[j],"Overhead");
                if (ttLOS.los === true) {
                    team.shooterIDs.push(shooterUnit.teamIDs[j]);
                }
            }

            let info = {
                name: team.name,
                id: team.id,
                refDistance: refDistance,
            }
            array.push(info);
        }

        array = array.sort(function(a,b) {
            return a.refDistance - b.refDistance; //order based on distance from initial target
        });

    log("Target Array")
    log(array)
        return array;
    }




    const Mistaken = (unit) => {
log("In Mistaken")
        //hits in here should be valid re type, distances etc
        let array = [];
        for (let i=0;i<unit.teamIDs.length;i++) {
            let team = TeamArray[unit.teamIDs[i]];
            if (team.hitArray.length === 0) {continue};
            team.priority = team.rank;
            if (team.token.get(SM.HQ) === true) {team.priority = 3};
            if (team.type === "Tank") {
                if (team.bailed === true) {
                    team.priority = -3;
                } else {
                    for (let j=0;j<team.hitArray.length;j++) {
                        let hit = team.hitArray[j];
                        if (hit.facing === "Side/Rear") {
                            team.priority += 1;
                        } else if (hit.range <= 16) {
                            team.priority += 1;
                        }
                    }
                }
            }
            array.push(team);
        }
        if (unit.hqUnit === true && unit.linkedUnitID !== "") {
            let linkedUnit = UnitArray[unit.linkedUnitID];
            for (let i=0;i<linkedUnit.teamIDs.length;i++) {
                let team = TeamArray[linkedUnit.teamIDs[i]];
                if (team.hitArray.length === 0) {continue};
                team.priority = team.rank;
                if (team.token.get(SM.HQ) === true) {team.priority = 3};
                if (team.bailed === true && team.type === "Tank") {team.priority = -3};
                array.push(team);
            }
        }
log("Array Length: " + array.length)
        array = array.sort(function(a,b){
            return b.priority - a.priority;
        })
        let roll = 6; //trial of 1st mistaken being passed
        //let roll = randomInteger(6);
log("Roll: " + roll)

        for (let i=0;i<array.length;i++) {
            if (roll < 3) {break};
            let t1 = array[i];
            let team1 = TeamArray[t1.id]
log("T1: " + t1.name + " / Priority: " + t1.priority)
            for (let j=(array.length - 1);j>i;j--) {
                let t2 = array[j];
                let team2 = TeamArray[t2.id]
log("T2: " + t2.name + " / Priority: " + t2.priority)
                if (t1.priority === t2.priority) {continue};
                let hitInfo = CompareHits(t1,t2); //eligible hits for swapping
log("Hit Info")
log(hitInfo)
                if (hitInfo.hits2.swappable.length < hitInfo.hits1.swappable.length) {
log("A Swap Occurs")
                    outputCard.body.push("Hits on " + t1.name + " swapped to " + t2.name);
                    let h1 = hitInfo.hits1.unswappable.concat(hitInfo.hits2.swappable);
                    let h2 = hitInfo.hits2.unswappable.concat(hitInfo.hits1.swappable);
log("Team1 New Hits: " + h1.length);
log("Team2 New Hits: " + h2.length);
                    TeamArray[t1.id].hitArray = h1;
                    TeamArray[t2.id].hitArray = h2;
                    roll = randomInteger(6);
log("Roll: " + roll)
                    break;
                }
            }
        }
    }

    const CreateBarrages = (msg) => {
        let observerID = msg.selected[0]._id;
log("In Create Barrages")        
        RemoveBarrageToken();
        RemoveLines();
        let observerTeam = TeamArray[observerID];
        SetupCard(observerTeam.name,"Artillery",observerTeam.nation);
        if (state.TY.step !== "Artillery and Air" && observerTeam.type !== "Helicopter") {
            outputCard.body.push("Call Artillery/Airstrike only in Artillery and Air Phase");
            PrintCard();
            return;
        }


        let img = Nations[observerTeam.nation].barrageimage;
        img = getCleanImgSrc(img);
        let represents = "-NMza8uwbYRMNnvLa-VU";
        let colour = Nations[observerTeam.nation].borderColour;
        let location = hexMap[observerTeam.hexLabel].centre;
        //create macro for barrage based on current art availability
        let abilArray = findObjs({  _type: "ability", _characterid: represents});
        //clear old abilities
        for(let a=0;a<abilArray.length;a++) {
            abilArray[a].remove();
        } 
        let abilityAction = "!BarrageLOS;@{selected|token_id}";
        AddAbility("Check",abilityAction,represents);

        let newToken = createObj("graphic", {   
            left: location.x,
            top: location.y,
            width: 70, 
            height: 70,  
            represents: represents,
            name: "Barrage Target",
            pageid: Campaign().get("playerpageid"),
            imgsrc: img,
            layer: "objects",
            aura1_color: colour,
            aura1_radius: 100,
        });
        toFront(newToken);
        state.TY.barrageID = newToken.id;

        let num = 100 + parseInt(observerTeam.player);
        let barrageTeam = new Team(newToken.id,num,num);

        let ai = ArtilleryInfo(newToken.id,observerTeam,represents);//adds artillery options to barrage token
log("Artillery Info")
log(ai)
        let unitIDs = ai.unitIDs;
        let two = ai.two;
        if (two === true) {
            newToken.set({
                aura2_radius: 200,
                aura2_color: "#d9d9d9",
            });
        }
        if (two === "Salvo Only") {
            newToken.set("aura1_radius",200);
        }
        if (unitIDs.length === 0) {
            outputCard.body.push("No Available Weapons");
            RemoveBarrageToken(newToken.id);
        } else {
            let info = {
                observerID: observerID,
                artUnitIDs: unitIDs,
            }
            state.TY.BarrageInfo = info;
            outputCard.body.push("Place Barrage Marker");
            outputCard.body.push("Choose Weapon When in Place");
        }
        PrintCard();
    }

    const ArtilleryInfo = (barrageID,spotter,barrageCharID) => {
        log("Spotter")
        log(spotter)
        let unitIDs = [];
        let normal = false;
        let salvo = false;
        let artUnits = [];
        let smokeFlag = false;
        let mineletFlag = false;
        let bombletFlag = false;
        let laserFlag = false;

        if (spotter.type === "Aircraft" || spotter.type === "Helicopter") {
            artUnits.push(UnitArray[spotter.unitID]);
        } else {
        log("Units")
            _.forEach(UnitArray,unit => {
                log(unit)
                if (unit.player === spotter.player && unit.artillery === true && unit.pinned() === false && unit.specialorder !== "Failed Blitz" && unit.specialorder.includes("Dig In") === false && unit.type !== "Aircraft" && unit.type !== "Helicopter" && unit.inReserve === false) {
                    artUnits.push(unit);
                }
            });
        }

log ("Art Units")
log(artUnits)
        for (let i=0;i<artUnits.length;i++) {
            let unit = artUnits[i];
            for (let j=0;j<unit.teamIDs.length;j++) {
                let team = TeamArray[unit.teamIDs[j]];
                if (team.special.includes("Artillery") === false || team.fired === true || team.aaFired === true || team.bailed === true) {continue};
                if (team.type !== "Aircraft" && team.type !== "Helicopter") {
                    if (hexMap[team.hexLabel].terrain.includes("Building") || team.moved === true) {
                        continue; //moved or in building
                    }
                }
                let weapon = team.artilleryWpn;
log(weapon)
                if (!weapon) {continue}
                if ((weapon.notes.includes("One Shot") || weapon.notes.includes("One-Shot")) && team.token.get(SM.oneshot) === true) {continue};

                if (weapon.moving === "Artillery" || weapon.halted === "Artillery") {
                    normal = true;
                }
                if (weapon.moving === "Salvo" || weapon.halted === "Salvo") {
                    salvo = true;
                }    
                if (weapon.notes.includes("Smoke Bombardment") === true && state.TY.smokeScreens[unit.player].includes(unit.id) === false) {
                    smokeFlag = true; //hasnt fired its smoke bombardment
                }
                if (team.special.includes("Minelets") && state.TY.minelets[unit.player].includes(unit.id) === false) {
                    mineletFlag = true;
                }
                if (team.special.includes("Bomblets")) {
                    bombletFlag = true;
                    salvo = true;
                }
                if (team.special.includes("Laser Guided") && spotter.spotAttempts === 0 && spotter.special.includes("Observer")) {
                    laserFlag = true; //takes all 3 spot attempts and only specialized observers
                }
                
                //add ability for this artillery unit to the barrage character
                let action = "!Artillery;" + barrageID + ";" + spotter.id + ";" + unit.id;
                let options = "";
                if (mineletFlag === true) {options += "|Minelets"};
                if (bombletFlag === true) {options += "|Bomblets"};
                if (laserFlag === true) {options += "|Laser Guided"};
                if (options === "") {
                    action += ";Normal";
                } else {
                    action += ";?{Ammunition|Normal" + options + "}";
                }

                let abilityName = weapon.name;
                AddAbility(abilityName,action,barrageCharID);
                if (smokeFlag === true) {
                    abilityName += ": Smoke";
                    action = "!Artillery;" + barrageID + ";" + spotter.id + ";" + unit.id + ";Smoke Bombardment;?{Smoke Direction|Northeast|East|Southeast|Southwest|West|Northwest}";
                    AddAbility(abilityName,action,barrageCharID);
                };
                unitIDs.push(unit.id);
                break;
            }
        }

        let two = false;
        if (salvo === true && normal === true) {
            two = true;
        }
        if (salvo === true && normal === false) {
            two = "Salvo Only";
        }
        let res = {
            unitIDs: unitIDs,
            two: two,
        }
        return res;
    }

    const RemoveBarrageToken = (barrageID) => {
        if (!barrageID) {
            barrageID = state.TY.barrageID;
        }
        state.TY.barrageID = "";
        let barrageTeam = TeamArray[barrageID];
        if (!barrageTeam) {return};
        let barrageToken = barrageTeam.token;
        if (barrageToken) {
            barrageToken.remove();
        }
        delete TeamArray[barrageID]
    }


    const BarrageLOS = (msg) => {
        let Tag = msg.content.split(";");
        let barrageID = Tag[1];
        let barrageTeam = TeamArray[barrageID];

        let observerID = state.TY.BarrageInfo.observerID;
        let observerTeam = TeamArray[observerID];
        let artUnitIDs = state.TY.BarrageInfo.artUnitIDs;
        let artUnits = [];
        let air = false;

        for (let i=0;i<artUnitIDs.length;i++) {
            let unitID = artUnitIDs[i];
            let unit = UnitArray[unitID];
            if (unit.type === "Aircraft" || unit.type === "Helicopter") {
                air = true;
            }
            artUnits.push(unit);
        }
        SetupCard("Barrage Check","",observerTeam.nation);
        //check LOS to Observer
        let observerLOS = LOS(observerID,barrageID,"Spotter");
        if (observerLOS.los === false) {
            outputCard.body.push("Observer does not have LOS to this point");
            outputCard.body.push("Only Ranged In Artillery can be called in");
            PrintCard();
            return;
        } 
        //check "Danger Close" - template within 2"  or 3" of edge if Salvo Template (6mm)
        let keys = Object.keys(TeamArray);
        let tooClose = [false,false];

        for (let i=0;i<keys.length;i++) {
            let team2 = TeamArray[keys[i]];
            if (team2.type === "Aircraft" || (team2.type === "Helicopter" && team2.landed() === false) || team2.type === "System Unit" || hexMap[team2.hexLabel].terrain.includes("Offboard")) {continue};
            if (team2.player !== observerTeam.player) {continue};
            let distance2 = team2.hex.distance(barrageTeam.hex);
            if (air === true) {
                //4" from edge of template 6mm
                if (distance2 < (2+4)) {tooClose[0] = true};
                if (distance2 < (4+4)) {tooClose[1] = true};
            } else {
                //2" from edge of template or 3" for Salvo 6mm
                if (distance2 < (2+2)) {tooClose[0] = true};
                if (distance2 < (4+3)) {tooClose[1] = true};
            }
        }
        outputCard.body.push("[U]Units[/u]");

        for (let i=0;i<artUnits.length;i++) {
            if (i>0) {outputCard.body.push("[hr]")};
            let artUnit = artUnits[i];
            let artIDs = artUnit.teamIDs;
            let artTeam = TeamArray[artIDs[0]];            
            let name = artTeam.artilleryWpn.name;
            outputCard.body.push(name);

            let salvo = false;
            if (artTeam.artilleryWpn.moving === "Salvo" || artTeam.artilleryWpn.halted === "Salvo") {
                salvo = true;
            }

            let smoke = false;
            if (artTeam.artilleryWpn.notes.includes("Smoke Bombardment") && state.TY.smokeScreens[artUnit.player].includes(artUnit.id) === false) {
                smoke = true;
            }
            if (tooClose[0] === true) {
                if (smoke === true) {
                    outputCard.body.push("[#FF0000]Too Close except for Smoke[/#]");
                } else {
                    outputCard.body.push("[#FF0000]Too Close to Friendlies[/#]");
                }
            } else if (tooClose[1] === true && salvo === true) {
                outputCard.body.push(name + ": [#FF0000]Too Close to Friendlies[/#]");
            }

            //check ranges and arc
            let oor = false;
            let oof = false;
            let num = 0;
            for (let j=0;j<artIDs.length;j++) {
                artTeam = TeamArray[artIDs[j]];
                let dist = artTeam.hex.distance(barrageTeam.hex);
                if (hexMap[artTeam.hexLabel].terrain.includes("Offboard") ){
                    dist += 100; //5km off map
                }


                if (dist > artTeam.artilleryWpn.maxRange || dist < artTeam.artilleryWpn.minRange) {
                    oor = true;
                    continue;
                };
                if (artTeam.artilleryWpn.notes.includes("Forward Firing") && hexMap[artTeam.hexLabel].terrain.includes("Offboard") === false) {
                    let facing = Facing(artTeam.id,barrageTeam.id);
                    if (facing !== "Front") {
                        oof = true;
                        continue;
                    };
                }
                num++;
            }

            if (num === 0) {
                if (oor === true) {
                    outputCard.body.push("[#ff0000]Unit Out of Range[/#]");
                }    
                if (oof === true) {
                    outputCard.body.push("[#ff0000]Unit Out of Arc[/#]");
                }      
            } else {
                outputCard.body.push("Unit has Range");
                if (salvo === true) {
                    outputCard.body.push("Will use larger Salvo Template");
                }
            }   
        }
        PrintCard();
    }

    const Artillery = (msg) => {
        let Tag = msg.content.split(";");
        let barrageID = Tag[1];
        let observerID = Tag[2];
        let artUnitID = Tag[3];
        let ammoType = Tag[4]; //Normal, Smoke Bombardment, Minelets, Bomblets
        let direction = Tag[5]; //in Smoke Bombardment
        let barrageTeam = TeamArray[barrageID];
        let observerTeam = TeamArray[observerID];
        let artilleryUnit = UnitArray[artUnitID];
    


        unitIDs4Saves = {};
        let rangedIn = false;
        let targetHex = barrageTeam.hex;

        SetupCard("Barrage","",observerTeam.nation);
        outputCard.body.push(artilleryUnit.name + " Firing");
    
        if (RangedInArray[artUnitID]) {
            if (RangedInArray[artUnitID].hexLabel === targetHex.label()) {
                rangedIn = true;
            } else {
                RemoveRangedInMarker(artUnitID);
            }
        }
    
        //check LOS to Observer
        let observerLOS = LOS(observerID,barrageID,"Spotter");
        if (observerLOS.los === false && rangedIn === false) {
            outputCard.body.push("[#ff0000]Observer does not have LOS[/#]");
            PrintCard();
            return;
        }

        let artilleryTeams = []; 
        let weapon;
        for (let i=0;i<artilleryUnit.teamIDs.length;i++) {
            let team = TeamArray[artilleryUnit.teamIDs[i]];
            if (team.artilleryWpn !== undefined) {
                weapon = team.artilleryWpn;

                let dist = team.hex.distance(barrageTeam.hex);
                if (hexMap[team.hexLabel].terrain.includes("Offboard") ){
                    dist += 100; //5km off map
                }  
                if (dist > team.artilleryWpn.maxRange || dist < team.artilleryWpn.minRange) {
                    continue;
                };
                if (team.artilleryWpn.notes.includes("Forward Firing") && hexMap[team.hexLabel].terrain.includes("Offboard") === false) {
                    let facing = Facing(team.id,barrageTeam.id);
                    if (facing !== "Front") {
                        continue;
                    };
                }
                if ((weapon.notes.includes("One Shot") || weapon.notes.includes("One-Shot")) && team.token.get(SM.oneshot) === true) {continue};

                artilleryTeams.push(team);
            }
        }
    
        if (artilleryTeams.length === 0) {
            outputCard.body.push("[#ff0000]No Teams have Range or Arc[/#]");
            PrintCard();
            return;
        }
    
        let templateRadius = 2;
        let tooCloseDist = 4; //2" to template radius
        if (weapon.moving === "Salvo" || weapon.halted === "Salvo") {
            templateRadius = 4;
            tooCloseDist = 7; //3" to template radius
        }
        if (artilleryTeams[0].type === "Aircraft" || artilleryTeams[0].type === "Helicopter") {
            tooCloseDist = templateRadius + 4;
        }
    
        if (ammoType !== "Smoke Bombardment" ) {
            //check "Danger Close"
            let keys = Object.keys(TeamArray);
            for (let i=0;i<keys.length;i++) {
                let team2 = TeamArray[keys[i]];
                if (team2.type === "Aircraft" || (team2.type === "Helicopter" && team2.landed() === false) || team2.type === "System Unit" || hexMap[team2.hexLabel].terrain.includes("Offboard") ||team2.player !== observerTeam.player ) {continue};
                let distance2 = team2.hex.distance(barrageTeam.hex);
                if (distance2 < tooCloseDist) {
                    outputCard.body.push("[#ff0000]Barrage is too close to Friendlies[/#]");
                    PrintCard();
                    return;
                };
            }
        }
    
        let addBattery = false;
        if (observerTeam.spotAttempts > 0) {
            addBattery = true;
        }
        let spotAttempts = 3 - observerTeam.spotAttempts; //as spotter may spot more than once, zeroed in Reset Flags routine
        if (spotAttempts < 3 && (ammoType === "Laser Guided" || ammoType === "Krasnopol")) {
            outputCard.body.push("Observer needs 3 Spot Attempts for Laser Guided Munitions");
            PrintCard();
            return;
        }
        let spotRolls = [];

        if (ammoType === "Laser Guided" || ammoType === "Krasnopol") {
            let laserTargetID = hexMap[targetHex.label()].tokenIDs[0];
            observerTeam.spotAttempts = 3;
            ShootingTwo(artilleryUnit.leaderID,laserTargetID,"Laser Guided",ammoType,observerID);
            RemoveBarrageToken()
            return;
        }

        //in range,arc of at least one team; rotate to face, mark as fired - weapon will be the weapon info, gun num will be # of teams firing
        let gunNum = artilleryTeams.length;
        for (let i=0;i<artilleryUnit.teamIDs.length;i++) {
            let artTeam = artilleryTeams[i]; //catch any art units that werent in facing, as they still rotate to fire
            if (artTeam.artilleryWpn === undefined) {continue};
            let phi = Angle(artTeam.hex.angle(barrageTeam.hex));
            artTeam.token.set("rotation",phi);
            artTeam.fired = true;
            artTeam.addCondition("Fired");
            if ((weapon.notes.includes("One Shot") || weapon.notes.includes("One-Shot")) && artTeam.token.get(SM.oneshot) === false) {
                artTeam.token.set(SM.oneshot,true);
            };
            if (state.TY.darkness === true) {
                shooterTeam.addCondition("Flare");
            }   
        }
    
        let needed = Math.max(observerTeam.skill,artilleryTeams[0].skill);

        let success = false;
        let crossTerrainCheck = false;
        let radiusHexes = [];
        let targetArray = [];
    
        if (ammoType !== "Smoke Bombardment") {
            //check if template over terrain and build array of any tokens in template
            radiusHexes = targetHex.radius(templateRadius);
            for (let i=0;i<radiusHexes.length;i++) {
                let hex = hexMap[radiusHexes[i].label()];
                if (hex.type > 0 && artilleryUnit.type !== "Aircraft" && artilleryUnit.type !== "Helicopter") {
                    crossTerrainCheck = true;
                }
                if (hex.teamIDs.length !== 0) {
                    for (let j=0;j<hex.teamIDs.length;j++) {
                        let team = TeamArray[hex.teamIDs[j]];
                        if (!team) {continue};
                        if (team.type === "Aircraft" || team.type === "System Unit") {continue};
                        if (team.token.get("layer") === "walls") {continue}; //passengers added if approp in process saves
                        targetArray.push(team);
                    }
                }
            }
            targetArray = [...new Set(targetArray)]; //eliminate duplicates
        }
    
        let tip2 = "";
        if (crossTerrainCheck === true) {
            needed += 1;
            tip2 += "<br>Template over Terrain or Smoke +1"; 
        };
        if (state.TY.darkness === true) {
            needed += 1;
            tip2 += "<br>Night Time +1";
        };
        if (observerTeam.special.includes("Observer")) {
            needed -=1;
            tip2 += "<br>Specialist Observer -1";
        }


    
        if (rangedIn) {needed = 0};
        let neededText;
        if (needed === 0) {
            neededText = "AUTO"
            tip2 = "<br>Automatic Due to Repeat Barrage";
        } else {
            neededText = needed.toString() + "/" + (Math.max(needed - 1,2)).toString() + "/" + (Math.max(needed - 2,2)).toString() + "+";
        }
    
        for (let i=0;i<spotAttempts;i++) {
            let roll = randomInteger(6);
            spotRolls.push(roll);
            if (roll >= (Math.max(needed - i,2))) {
                success = true;
                break;
            }
        }
    
        weaponName = weapon.name;
        let extra = "";
        if (ammoType === "Bomblets") {extra = "DPICM Rounds with "};
        if (ammoType === "Minelets") {extra = "Scatterable Minelets with "};
        if (ammoType === "Smoke Bombardment") {extra = "Smoke Screen with "};
    
        outputCard.body.push("Firing " + extra + weaponName)
        if (observerTeam.type !== "Aircraft" && observerTeam.type !== "Helicopter") {
            observerTeam.addCondition("Spot");
        }
        let hittip = "Ranging In Rolls: " + spotRolls.toString() + " vs. " + neededText + tip2;
    
        observerTeam.spotAttempts += spotRolls.length;
        spotAttempts = observerTeam.spotAttempts
    
        let sound;
        if (weapon.type === "Small Arms") {
            sound = "Mortars";
        } else if (weapon.type === "Artillery") {
            sound = "Artillery";
        } else if (weapon.type === "Rockets") {
            if (artilleryTeams[0].type === "Aircraft") {
                sound = "ATG"
            } else {
                sound = "Katyusha";
            }
        }
        PlaySound(sound);

        if (success === false) {
            let fail = '[🎲](#" class="showtip" title="' + hittip + ')' + "Failed to Range In";
            outputCard.body.push(fail);
            RemoveBarrageToken()
            PrintCard();
            return
        } else {
            let text = ["","1st","2nd","3rd"];
            let text2 = ["","","+1 to Roll Needed to Hit","+2 to Roll Needed to Hit"];
            if (observerTeam.type !== "Aircraft" && observerTeam.type !== "Helicopter" && rangedIn === false) {
                PlaceRangedInMarker(artilleryUnit,targetHex);
            }
            let success = '[🎲](#" class="showtip" title="' + hittip + ') Ranged in on the ' + text[spotAttempts] + ' Attempt';
            if (addBattery === true) {
                outputCard.body.push("(Ranging in Additional Battery)")
            }
            outputCard.body.push(success);
            if (ammoType !== "Smoke Bombardment") {
                outputCard.body.push(text2[spotAttempts]);
            }
            if (neededText === "AUTO") {
                outputCard.subtitle = "Repeat Bombardment";
            }
    
            if (ammoType === "Smoke Bombardment") {
                let num = gunNum * 4;
                SmokeScreen(targetHex,num,direction,artilleryUnit.id);
                state.TY.smokeScreens[artilleryUnit.player].push(artilleryUnit.id); //tracks that unit fired its one smoke bombardment
                outputCard.body.push("Smoke Screen successfully placed");
                RemoveBarrageToken();
                PrintCard();
                return;
            } else if (ammoType === "Minelets") {
                let num = Math.ceil(gunNum/3);
                let s = "";
                if (num > 1) {s = "s"};
                outputCard.body.push("Place " + num + ' Minefield Marker' + s + ' within 2 hexes of the Ranged In Target');
                state.TY.minelets[currentPlayer].push(artilleryUnit.id);
                PrintCard();
                return;
            } else if (ammoType === "Laser Guided") {
            
            
            
            } else {
                if (observerLOS.los === false) {
                    outputCard.body.push("+1 to Roll Needed to Hit due to Spotter LOS");
                }
                if (gunNum < 3) {
                    outputCard.body.push("Hits Will be Rerolled Due to # of Guns");
                } else if (gunNum > 4) {
                    outputCard.body.push("Misses Will be Rerolled Due to # of Guns");
                }
                if (observerTeam.spotAttempts < 3 && observerTeam.unitID !== artilleryUnit.id) {
                    outputCard.body.push("The Spotting Unit can still Spot for other Artillery Units");
                    outputCard.body.push((3 - observerTeam.spotAttempts) + " Spot Attempts Left");
                }
            }
        }
        //roll hits and saves
        outputCard.body.push("[hr]");
    
        if (targetArray.length === 0) {
            outputCard.body.push("No Targets Under Template");
        }
    
        pinningUnits = [];

        for (let i=0;i<targetArray.length;i++) {
            let team = targetArray[i];
            let unitID = team.unitID;
            let unit = UnitArray[unitID];
            let neededToHit = parseInt(team.hit) + (spotAttempts - 1);
            if (observerLOS.los === false) {neededToHit += 1};//repeat bombardment, spotter doesnt have LOS
            let roll = randomInteger(6);
            if (gunNum < 3 && roll >= neededToHit) {
                //reroll hits if only 1 or 2 guns
                roll = randomInteger(6);
            }
            if (gunNum > 4 && roll < neededToHit) {
                //reroll misses if 5+ guns
                roll = randomInteger(6);
            }
            let tip =  "To Hit: " + roll + " vs. " + neededToHit + "+";
    
            if (ammoType === "Bomblets") {
                weapon = {
                    name: "DPICM Rounds",
                    at: 3,
                    fp: 6,
                    notes: " ",
                    type: "Artillery",
                }
            }

            let hit = {
                weapon: weapon,
                bp: hexMap[team.hexLabel].bp,
                facing: "Top",
                range: 0,
                shooterType: artilleryTeams[0].type,
                rangedIn: rangedIn,
                closeCombat: false,
            }

            if (roll >= neededToHit) {
                team.hitArray = [hit];
                if (team.type === "Infantry" || team.type === "Unarmoured Tank" || team.type === "Gun") {
                    pinningUnits.push(unit);                             
                }
                if (!unitIDs4Saves[unitID]) {
                    unitIDs4Saves[unitID] = false; //no mistaken for artillery
                }
                outputCard.body.push('[🎲](#" class="showtip" title="' + tip + ')' + "[#ff0000]" + team.name + ": Hit[/#]");
            } else {
                outputCard.body.push('[🎲](#" class="showtip" title="' + tip + ')' + team.name + ": Missed");
            }
        }
        pinningUnits = [...new Set(pinningUnits)];
        if (pinningUnits.length > 0) {
            outputCard.body.push("[hr]");
            _.forEach(pinningUnits,unit => {
                let courage = TeamArray[unit.teamIDs[0]].courage;
                let roll = randomInteger(6);
                let end = unit.name + ": Not Pinned";
                if (roll < courage) {
                    end = "[#ff0000]" + unit.name + ": Pinned";
                    unit.pin();
                } 
                let line = '[🎲](#" class="showtip" title="Roll: ' + roll + " vs. " + courage +  '+)' + end;
                outputCard.body.push(line);
            });
        }
        PrintCard();
        ProcessSaves("Artillery");
    }

    const RemoveLines = () => {
        let lineIDArray = state.TY.LOSLines;
        if (!lineIDArray) {
            state.TY.LOSLines = [];
            return;
        }
        for (let i=0;i<lineIDArray.length;i++) {
            let id = lineIDArray[i];
            let path = findObjs({_type: "path", id: id})[0];
            if (path) {
                path.remove();
            }
        }
        state.TY.LOSLines = [];  
    }

    const PlaceRangedInMarker = (artilleryUnit,targetHex) => {
        let nation = artilleryUnit.nation;
        let img = getCleanImgSrc(Nations[nation].rangedIn);
        let team = TeamArray[artilleryUnit.teamIDs[0]];
        let markers = team.token.get("statusmarkers").split(",");
log("Markers")       
log(markers)
        let marker = returnCommonElements(markers,Nations[nation].platoonmarkers);
log("Platoon Marker")
log(marker);
        marker = "status_" + marker;

        let location = hexMap[targetHex.label()].centre;
        let newToken = createObj("graphic", {   
            left: location.x,
            top: location.y,
            width: 70, 
            height: 70,
            name: "rangedin",  
            isdrawing: true,
            pageid: team.token.get("pageid"),
            imgsrc: img,
            layer: "map",
            gmnotes: artilleryUnit.id,
            statusmarkers: marker,
        });
        toFront(newToken);
        RangedInArray[artilleryUnit.id] = {
            hexLabel: targetHex.label(),
            tokenID: newToken.id,
        }
        return newToken; //used for preplanning
    }

    const RemoveRangedInMarker = (unitID) => {
        if (!RangedInArray[unitID]) {return};
        let tok = findObjs({_type:"graphic", id: RangedInArray[unitID].tokenID})[0];
        if (tok) {
            tok.remove();
        }
        delete RangedInArray[unitID];
    }

    const PlaceRangedIn = (msg) => {
        if (state.TY.turn > 0) {
            sendChat("","Only useable at Start of Game");
            return;
        }
        let artTeamID = msg.selected[0]._id;
        let artTeam = TeamArray[artTeamID];
        let artUnit = UnitArray[artTeam.unitID];
        if (RangedInArray[artUnit.id]) {
            RemoveRangedInMarker(artUnit.id);
        }
        let token = PlaceRangedInMarker(artUnit,artTeam.hex);
        token.set("layer","objects");
        SetupCard("Preplan Artillery",artUnit.name,artUnit.nation);
        outputCard.body.push("Place Token where desired");
        outputCard.body.push("Then Click Button to Finalize");
        ButtonInfo("Place","!FinalizeRangedIn;" + token.id);
        PrintCard();
    }

    const FinalizeRangedIn = (msg) => {
        let Tag = msg.content.split(";");
        let id = Tag[1];
        let token = findObjs({_type:"graphic", id: id})[0];
        let location = new Point(token.get("left"),token.get("top"));
        let hex = pointToHex(location);
        let label = hex.label();
        location = hexMap[label].centre;
        token.set({
            left: location.x,
            top: location.y,
            layer: "map",
        });
    }

    const SmokeScreen = (targetHex,number,direction,unitID) => {
        let currentHex = targetHex;
        for (let i=0;i<number;i++) {
            let rotation = randomInteger(12) * 30;
            let location = hexMap[currentHex.label()].centre
            let img = getCleanImgSrc("https://s3.amazonaws.com/files.d20.io/images/254450996/PZo4LXP6LH6yN3tt674bDg/thumb.png?1636311012");
            let newToken = createObj("graphic", {   
                left: location.x,
                top: location.y,
                width: 100, 
                height: 100,  
                rotation: rotation,
                name: "SmokeScreen",
                isdrawing: true,
                pageid: Campaign().get("playerpageid"),
                imgsrc: img,
                layer: "map",
                gmnotes: player,
            });
            toFront(newToken);
            let sInfo = {
                hexLabel: currentHex.label(),
                id: newToken.id,
                type: "Smokescreen",
            }
            SmokeArray.push(sInfo); 
            hexMap[currentHex.label()].smokescreen = true;
            hexMap[currentHex.label()].smoke = true;
            currentHex = currentHex.neighbour(direction);
        }   
    }

    const ClearSmoke = (type) => {
        let newSmoke = []
        for (let i=0;i<SmokeArray.length;i++) {
            let info = SmokeArray[i];
            let hexLabel = info.hexLabel;
            if (type === info.type) {
                if (hexMap[hexLabel]) {
                    hexMap[hexLabel].smoke = false;
                    hexMap[hexLabel].smokescreen = false;
                }
                let token = findObjs({_type:"graphic", id: info.id})[0];
                if (!token) {
                    log(info)
                } else {
                    token.remove();
                }
            } else {
                newSmoke.push(info);
            }
        }
        SmokeArray = newSmoke;
    }

    const DirectSmoke = (team,unitID) => {
        //place smoke on team
        let location = team.location;
        let rotation = randomInteger(12) * 30;
        let img = getCleanImgSrc("https://s3.amazonaws.com/files.d20.io/images/196609276/u8gp3vcjYAunqphuw6tgWw/thumb.png?1611938031");
        let newToken = createObj("graphic", {   
            left: location.x,
            top: location.y,
            width: 100, 
            height: 100,  
            rotation: rotation,
            name: "Smoke",
            isdrawing: true,
            pageid: Campaign().get("playerpageid"),
            imgsrc: img,
            layer: "map",
            gmnotes: currentPlayer,
        });
        toFront(newToken);
        //add to hexMap
        hexMap[team.hexLabel].smoke = true;
        //add to Smoke Array
        let sInfo = {
            hexLabel: team.hexLabel,
            id: newToken.id, //id of the Smoke token, can be used to remove later
            type: unitID,
        }
        SmokeArray.push(sInfo);
    }


    const SwapLeader = (unit) => {
        let text = "";
        if (unit.teamIDs.length < 2) {return text}; 
        let oldLeader = TeamArray[unit.teamIDs[0]];
        let newLeader;
        let closestDist = Infinity;
        for (let i=1;i<unit.teamIDs.length;i++) {
            let team2 = TeamArray[unit.teamIDs[i]];
            if (team2.inCommand === false || team2.characterID !== team1.characterID || team2.bailed === true) {continue};
            let dist = oldLeader.hex.distance(team2.hex);
            if (dist < closestDist) {
                newLeader = team2;
                closestDist = dist;
            }
        }
        if (newLeader !== undefined) {
            let aura1 = oldLeader.token.get("aura1_color");
            let name1 = oldLeader.name;
            let name2 = newLeader.name;
            newLeader.token.set({
                name: name1,
                aura1_color: aura1,
            });
            oldLeader.token.set({
                name: name2,
                aura1_color: "transparent",
            });
            oldLeader.name = name2;
            newLeader.name = name1;
            let old_index = unit.teamIDs.indexOf(newLeader.id);
            unit.teamIDs.splice(0, 0, unit.teamIDs.splice(old_index, 1)[0]);
            text = name1 + " takes command of " + name2;
        }
        return text;
    }

    const EndFire = (msg) => {
        let Tag = msg.content.split(";");
        let type = Tag[1];
        ProcessSaves(type);
    }

    const ProcessSaves = (shootingType) => {
log("In Process Saves")
        let keys = Object.keys(unitIDs4Saves);
log(keys)
        if (keys.length === 0) {return};
        for (let i=0;i<keys.length;i++) {
            let unit = UnitArray[keys[i]];
            let pinMargin = 5;
            if (unit.size > 11) {pinMargin = 8};
            let casualties = 0;
            let bailedOut = 0;
            SetupCard(unit.name,"Saves",unit.nation);
            if (unitIDs4Saves[keys[i]] === true) {
                //run Mistaken
                Mistaken(unit);
            }
            let flamethrowerFlag = false;
            let unitLeader = TeamArray[unit.teamIDs[0]];
            let unitHits = parseInt(unitLeader.token.get("bar3_value"));

            log(unit.teamIDs)
            let teamIDs = DeepCopy(unit.teamIDs)

            _.forEach(teamIDs,id => {
                let team = TeamArray[id];
log(team.name)
log("Hits: " + team.hitArray.length)
                unitHits += team.hitArray.length;
                let results = ProcessSavesTwo(team);
log(results)
                if (results) {
                    for (let m=0;m<results.length;m++) {
                        outputCard.body.push(results[m]);
                    }
                }
                //turn  flamethrowerflag true if hit by flamethrower
                team.hitArray = [];
                team.shooterIDs = [];
            })


            if (unitHits === 0) {
                outputCard.body.push("(Swapped)");
                continue;
            }
            unit = UnitArray[keys[i]];
            if (unit) {
                if (unit.type === "Infantry" || unit.type === "Gun" || unit.type.includes("Unarmoured")) {
                    unitLeader = TeamArray[unit.teamIDs[0]]; //in case original killed
                    unitLeader.token.set("bar3_value",unitHits);
                    if (unitHits >= pinMargin && unit.pinned() === false) {
                        outputCard.body.push("The Unit is Pinned");
                        unit.pin();
                        if (shootingType === "Defensive") {
                            outputCard.body.push("The Unit must Fall Back");
                        }
                    }
                    if (flamethrowerFlag === true && unit.pinned() === false) {
                        outputCard.body.push("The Unit is Pinned");
                        unit.pin();
                    }
                    if (shootingType === "Close Combat" && unitHits > 0) {
                        outputCard.body.push("The Unit is Pinned");
                        unit.pin();
                    }
                } else if (unit.type === "Tank" && shootingType === "Defensive") {
                    unitLeader = TeamArray[unit.teamIDs[0]]; //in case original killed
                    if ((bailedOut + casualties) >= 2) {
                        outputCard.body.push("The Unit must Fall Back");
                    }
                    if (unit.teamIDs.length === 1 && unitLeader.bailed === true) {
                        outputCard.body.push("The Unit must Fall Back");
                    }
                }
            } else {
                outputCard.body.push("Entire Unit Killed");
            }

            unit.linkedUnitID = "";
            PrintCard();
        }
        unitIDs4Saves = {};
    }




    const ProcessSavesTwo = (team) => {
        let hits = team.hitArray;
        if (hits.length === 0 || hits === undefined) {return};
        let tip = "";
        let saveResult = [];
        let outputArray = {
            "deflect": 0,
            "minor": 0,
            "destroyed": 0,
            "bailed": 0,
            "bailedAgain": 0,
            "flees": 0,
            "saved": 0,
            "cover": 0,
            "smoked": 0,
        }
        let save; //as single hit's save can then carry onto output part
    
        for (let k=0;k<hits.length;k++) {
            let hit = hits[k];
            save = team.Save(hit,k+1);
            if (k>0) {
                tip += "<br>";
            }
            tip += save.tip
            outputArray[save.result] += 1;
        }
    
        if (hits.length === 1) {
            saveResult.push('[🎲](#" class="showtip" title="' + tip + ') ' + team.name + ": 1 Hit");
            saveResult.push(SaveResults[save.result]);
        } else {
            saveResult.push('[🎲](#" class="showtip" title="' + tip + ') ' + team.name + ": " + hits.length + " Hits");
            if (team.type === "Tank") {
                if (outputArray.destroyed > 0) {
                    saveResult.push(SaveResultsMult.destroyed);
                } else if (outputArray.flees > 0) {
                    saveResult.push(SaveResultsMult.flees);
                } else if (outputArray.bailedAgain > 0) {
                    saveResult.push(SaveResultsMult.bailedAgain);
                } else if (outputArray.bailed > 0) {
                    saveResult.push(SaveResultsMult.bailed);
                } else if (outputArray.minor > 0) {
                    saveResult.push(SaveResultsMult.minor);
                } else if (outputArray.deflect > 0) {
                    saveResult.push("All Hits Deflected by Armour");
                }
                if (outputArray.smoked > 0) {
                    saveResult.push("Target Smoked");
                }
            } else if (team.type === "Infantry" || team.type === "Unarmoured Tank" || team.type === "Gun") {
                if (outputArray.destroyed > 0) {
                    saveResult.push(SaveResultsMult.destroyed);
                } else if (outputArray.cover > 0) {
                    saveResult.push(SaveResultsMult.cover);
                } else if (outputArray.saved > 0) {
                    saveResult.push(SaveResultsMult.saved);
                }
                if (outputArray.smoked > 0) {
                    saveResult.push("Target Smoked");
                }
            } else if (team.type === "Aircraft" || team.type === "Helicopter") {
                if (outputArray.destroyed > 0) {
                    saveResult.push(SaveResultsMult.destroyed);
                } else if (outputArray.minor > 0) {
                    saveResult.push(SaveResultsMult.minor);
                } else {
                    saveResult.push(SaveResultsMult.saved);
                }
            }
        }
    
        if (outputArray.destroyed > 0) {
            team.kill();
        }
    
        team.hitArray = [];
        team.priority = 0;
    
        return saveResult;
    }
    

    const InCC = (team1,newHex) => {
log(team1.name + " is Moving")
        if (team1.token.get("layer") === "walls" || state.TY.step !== "Assault" ) {return};
        let unit = UnitArray[team1.unitID];
        if (state.TY.step === "Assault" && team1.order !== "Assault") {
            sendChat("","Team does not have an Assault Order");
            return true;
        };
        if (unit.pinned() === true) {
            sendChat("","Unit is Pinned");
            return true;
        }
        let ccError = false;
        let teamKeys = Object.keys(TeamArray);   
        let defendingUnit;     
        for (let i=0;i<teamKeys.length;i++) {
            let team2 = TeamArray[teamKeys[i]];
            if (team2.id === team1.id || team2.player === team1.player || team2.type === "System Unit") {continue};
log(team2.name)

            let dist = newHex.distance(team2.hex);
            if (dist > 1) {continue};
log("In B2B")
            if (team1.special.includes("Heavy Weapon")) {
                sendChat("","This Team is a Heavy Weapons Team and cannot Charge into Contact");
                ccError = true;
                break;
            }
            if (team1.queryCondition("AAFire") === true) {
                sendChat("","This Team fired AA Fire and cannot Charge into Contact");
                ccError = true;
                break;
            }
            defendingUnit = UnitArray[team2.unitID];
            if (defendingUnit.order === "Assault") {
                defendingUnit.order = "Tactical";
                _.forEach(defendingUnit.teamIDs,id => {
                    let tm = TeamArray[id];
                    if (tm.order === "Assault") {
                        tm.order = "Tactical";
                        tm.addCondition("Tactical");
                    }
                });
            }
        }

        return ccError;
    }

    const Defensive = (team1,action) => {
        //mark/update tokens able to defensive fire
        let teamKeys = Object.keys(TeamArray);
        for (let i=0;i<teamKeys.length;i++) {
            let team2 = TeamArray[teamKeys[i]];
            if (team2.id === team1.id || team2.player === team1.player || team2.token.get("layer") === "walls") {continue};
            let dist = team1.hex.distance(team2.hex);
            let chargeDist = team1.hex.distance(team1.prevHex);
log("Charge Dist: " + chargeDist)
            if (action === "Add" && dist <= 4 && team2.token.get(SM.surprised) === false) {
                if (dist === 1 && team1.fired === false && hexMap[team1.prevHexLabel].type > 0 && chargeDist <= 2) {
                    team2.token.set(SM.defensive,false);
                    team2.token.set(SM.surprised,true);
                    continue;
                };
                team2.ccIDs.push(team1.id);
                team2.token.set(SM.defensive,true);   
            }
            if (action === "Remove") {
                let index = team2.ccIDs.indexOf(team1.id);
                if (index > -1) {
                    team2.ccIDs.splice(index,1);
                }
                if (team2.ccIDs.length === 0) {
                    team2.token.set(SM.defensive,false);
                }
            }
        }
    }

    const CloseCombat = (msg) => {
        //initial feed in, subsequent should go to Two ie. round 2 on
        if (!msg.selected) {return};
        let assaultingPlayer,id;
        AssaultIDs = [[],[]];
        for (let i=0;i<msg.selected.length;i++) {
            let id = msg.selected[i]._id;
            let team = TeamArray[id];
            if (!team) {continue};
            if (team.type === "Aircraft" || team.type === "Helicopter") {continue};
            let unit = UnitArray[team.unitID];
            if (unit.order.includes("Assault")) {
                assaultingPlayer = unit.player;
            }
            AssaultIDs[team.player].push(id);
        }
        if (assaultingPlayer === undefined) {
            sendChat("",'No Teams Selected with Assault Orders');
            return;
        }
        SetupCard("Start Close Combat","",state.TY.nations[assaultingPlayer][0]);
        ButtonInfo("Click Button to Start","!CloseCombatTwo;" + assaultingPlayer + ";1");
        PrintCard();
    }

    const CloseCombatTwo = (msg) => {
        unitIDs4Saves = [];
        let Tag = msg.content.split(";");
        let attackingPlayer = parseInt(Tag[1]);
        let defendingPlayer = (attackingPlayer === 0) ? 1:0;
        let round = Tag[2];
        //AssaultIDs has 2 sides worth of IDs
        SetupCard("Assault","Round: " + round,state.TY.nations[attackingPlayer]);
        //check which are in B2B contact
        b2bFlag = false;
        tankVtankFlag = false;
        let attackingTeamIDs = {};
        let defendingTeamIDs = {};

        for (let i=0;i<AssaultIDs[attackingPlayer].length;i++) {
            let team1 = TeamArray[AssaultIDs[attackingPlayer][i]];
            for (let j=0;j<AssaultIDs[defendingPlayer].length;j++) {
                let team2 = TeamArray[AssaultIDs[defendingPlayer][j]];
                let dist = team1.hex.distance(team2.hex);
                if (dist < 2) {
                    if (team1.type === "Tank" && team2.type === "Tank") {
                        tankVtankFlag = true;
                        continue;
                    }
                    b2bFlag = true;
                    if (!attackingTeamIDs[team1.id]) {
                        attackingTeamIDs[team1.id] = [team2.id];
                    } else {
                        attackingTeamIDs[team1.id].push(team2.id);
                    }
                    if (!defendingTeamIDs[team2.id]) {
                        defendingTeamIDs[team2.id] = [team1.id];
                    } else {
                        defendingTeamIDs[team2.id].push(team1.id);
                    }
                }
            }
        }

        if (b2bFlag === false) {
            outputCard.body.push("There are no Teams in Base to Base Contact");
            if (tankVtankFlag === true) {
                outputCard.body.push("Tanks cannot Assault other Tanks");
            }
            outputCard.body.push("The Assault is over");
            PrintCard();
            return;
        }
        //each array will be an array indexed by the attacker/defender team's id, with the contents being the target IDs in B2B contact
        // eg. attackingTeamIDs[attackers Team ID] = [defenders Team ID1, defenders Team ID2, ...]

        let attackerIDs = Object.keys(attackingTeamIDs);

        _.forEach(attackerIDs,attackerID => {
                let attTeam = TeamArray[attackerID];
                let line,end,bracket1,bracket2;
                let defenders = []; //teams
                _.forEach(attackingTeamIDs[attackerID],defenderID => {
                        let team = TeamArray[defenderID];
                        if (team) {defenders.push(team)}
                })
        
                let needed = attTeam.assault;
                let attacks = parseInt(attTeam.token.get("bar1_value")) || 1;
                if (attTeam.type === "Unarmoured Tank" || attTeam.bailed === true) {attacks = 0};

                // attTeam.assaultWpns
                let weapon = attTeam.weaponArray[0];
        
                for (let i=0;i<attacks;i++) {
                        let roll = randomInteger(6);
                        if (roll < needed) {
                                bracket1 = "";
                                bracket2 = "";
                                end = " Misses";
                        } else {
                                let targNum = 0;
                                let facing = "Side/Rear";
                                if (defenders.length > 1) {
                                        for (let t=0;t<defenders.length - 1;t++) {
                                                let t1 = defenders[t];
                                                let num1 = t1.hitArray.length;
                                                let t2 = defenders[t+1];
                                                let num2 = t2.hitArray.length;
                                                if (num2 < num1) {
                                                    targNum = (t+1);
                                                    break;
                                                }
                                        }
                                }
                                let targetTeam = defenders[targNum];
                                end = " Hits " + targetTeam.name;
        
                                if (targetTeam.type === "Tank") {
                                        weapon = attTeam.assaultWpns[i];
                                        if (weapon.name.includes("Improvised")) {facing = "Top"};
                                } else if (targetTeam.type !== "Tank" && attTeam.type === "Tank") {
                                        weapon.name = "MGs and Tank Treads"
                                }
                                hit = {
                                        weapon: weapon,
                                        bp: false,
                                        facing: facing,
                                        range: 1,
                                        shooterID: attTeam.id,
                                        shooterType: attTeam.type,
                                        rangedIn: false,
                                        closeCombat: true,
                                        special: "nil",
                                }
                                targetTeam.hitArray.push(hit);
                                end += ' w/ ' + weapon.name;
                                bracket1 = "[#ff0000]";
                                bracket2 = "[/#]";
                                if (!unitIDs4Saves[targetTeam.unitID]) {
                                    unitIDs4Saves[targetTeam.unitID] = false;
                                } 
                        }
                        line = '[🎲](#" class="showtip" title="Roll: ' + roll + " vs " + needed + '+ )' + bracket1 + attTeam.name + end + bracket2;
                        outputCard.body.push(line);
                }
        });

        PrintCard(); //outputs the hits
        ProcessSaves("Close Combat");

        let finalDefIDs = [];
        let defUnitIDs = [];
        let bailedIDs = [];
        _.forEach(AssaultIDs[defendingPlayer],id2 => {
                let team2 = TeamArray[id2];
                if (team2) {
                        if (team2.bailed === true) {bailedTeamIDs.push(id2)};
                        if (team2.type !== "Unarmoured Tank" && team2.bailed === false) {
                                for (let i=0;i<AssaultIDs[attackingPlayer].length;i++) {
                                        let id1 = AssaultIDs[attackingPlayer][i];
                                        let team1 = TeamArray[id1];
                                        if (team1) {
                                                let dist = team1.hex.distance(team2.hex);
                                                if (dist <= 2) {
                                                        finalDefIDs.push(id2);
                                                        defUnitIDs.push(team2.unitID);
                                                        break;
                                                }
                                        }
                                }
                        }
                }
        })

        defUnitIDs = [...new Set(defUnitIDs)];

        if (finalDefIDs.length === 0) {
                SetupCard("Assault Over","",state.TY.nations[attackingPlayer]);
                outputCard.body.push("The Assault is Over");
                outputCard.body.push('Any surviving Losing Teams must move at Tactical speed the shortest distance to be further than 3 hexes away from all enemy Teams');
                outputCard.body.push("Any Teams not able to do so (due to Bailed or Movement) surrender and are destroyed");
                outputCard.body.push('The Winning Teams may Consolidate 2 hexes, this Move may not bring them into contact with an enemy Team.')  
                AssaultIDs = [[],[]];
                _.forEach(bailedIDs,id => {
                    let team = TeamArray[id];
                    team.kill();
                })
        } else {
                SetupCard("Counterattack","",state.TY.nations[defendingPlayer]);
                outputCard.body.push("The Defenders may now choose to Counterattack or may Break Off");
                let part2 = "!RollD6;Counterattack;";
                _.forEach(defUnitIDs,unitID => {
                    part2 += unitID + ";";
                })
                part2 += round;
                ButtonInfo("Counterattack Roll",part2);
                ButtonInfo("Break Off","!BreakOff;" + defendingPlayer);
        }

        PrintCard();
    }

    const PlaceInReserve = (msg) => {
        if (!msg.selected) {return};
        SetupCard("Place in Reserve","","Neutral");
        for (let i=0;i<msg.selected.length;i++) {
            let id = msg.selected[i]._id;
            let team = TeamArray[id];
            if (!team) {continue};
            let unit = UnitArray[team.unitID];
            if (unit.inReserve === true) {continue};
            unit.inReserve = true;
            let unitLeader = TeamArray[unit.teamIDs[0]];
            unitLeader.token.set("aura1_color",Colours.brown);
            outputCard.body.push(unit.name + " is Placed in Reserve");
        }
        PrintCard();
    }

    const BuildReserve = () => {
        let keys = Object.keys(UnitArray);
        for (let i=0;i<keys.length;i++) {
            let unit = UnitArray[keys[i]];
            if (unit.type === "System Unit") {continue}
            let unitLeader = TeamArray[unit.teamIDs[0]];
            if (!unitLeader) {
                log("In Build Reserve")
                log(unit)
                continue;
            }
            let offboard = hexMap[unitLeader.hexLabel].terrain.includes("Offboard");
            if (unitLeader.token.get("aura1_color") === Colours.brown && offboard === true) {
                unit.inReserve = true;
            }
        }
    }


    const Mount = (msg) => {
        let Tag = msg.content.split(";");
        let passengerID = Tag[1];
        let transportID = Tag[2];
        let passengerTeam = TeamArray[passengerID];
        let transportTeam = TeamArray[transportID];
        SetupCard(passengerTeam.name,"Mount",passengerTeam.nation);
        let errorMsg;
        let distance = passengerTeam.hex.distance(transportTeam.hex);
        if (state.TY.step !== "Movement") {
            errorMsg = "Teams can only Mount in the Movement Phase";
        }
        if (transportTeam.maxPass === 0) {
            errorMsg = "Not a Transport or Tank";
        }
        if (distance > 1) {
            errorMsg = "Need to be Adjacent to Transport";
        }
        if (!state.TY.passengers[transportID]) {
            state.TY.passengers[transportID] = [];
        }
        let passengers = state.TY.passengers[transportID];
        let room = parseInt(transportTeam.maxPass) - parseInt(passengers.length);
        if (room < 1) {
            errorMsg = "No More Room";
        }
        if (errorMsg !== undefined) {
            outputCard.body.push(errorMsg);
            PrintCard();
            return;
        }
        passengers.push(passengerID);
        if (passengers.length === 1) {
            //after first, dont need to add icon
            transportTeam.addCondition("Passengers");
        }
        state.TY.passengers[transportID] = passengers;
        //move passengerTeam token to lighting layer
        passengerTeam.token.set("layer","walls");

        outputCard.body.push(passengerTeam.name + " Loaded");
        outputCard.body.push(transportTeam + " has " + (room-1) + " Transport Left");
        PrintCard();
    }

    const Dismount = (msg) => {
        let id = msg.selected[0]._id;
        let transportTeam = TeamArray[id];
        let passengers;
        SetupCard(transportTeam.name,"Dismount",transportTeam.nation);
        if (state.TY.step !== "Movement") {
            outputCard.body.push("Can only Dismount in the Movement Step");
            PrintCard();
            return;
        }
        if (!state.TY.passengers[id]) {
            outputCard.body.push("No Passengers");
        } else {
            passengers = state.TY.passengers[id];
            for (let i=0;i<passengers.length;i++) {
                let passengerTeam = TeamArray[passengers[i]];
                passengerTeam.token.set("layer","objects");
                toFront(passengerTeam);
            }
            transportTeam.removeCondition("Passengers");
            state.TY.passengers[id] = [];
            outputCard.body.push("Teams can be Activated");
            outputCard.body.push("Orders must include Movement so that the Team moves away from the Transport");
        }
        PrintCard();
    }

    const PlaceInFoxholes = (msg) => {
        let unit = UnitArray[TeamArray[msg.selected[0]._id].unitID];
        if (unit) {
            let array = [];
            _.forEach(unit.teamIDs,id=>{
                array.push(TeamArray[id]);
            })
            DigIn(array);
        }
    }

    const Test = (msg) => {
        let id = msg.selected[0]._id;
        let team = TeamArray[id];
        let unit = UnitArray[team.unitID];
        cTeam = CentreTeam(unit);
        sendChat("","Central Team: " + cTeam.name)
    }


    const SizeHex = (msg) => {
        let tokenIDs = [];
        for (let i=0;i<msg.selected.length;i++) {
            tokenIDs.push(msg.selected[i]._id);
        }
        _.forEach(tokenIDs,tokenID => {
            let token = findObjs({_type:"graphic", id: tokenID})[0];
            token.set({
                width: 75,
                height: 89,
            })
        })
    }

    const EnterAircraft = (msg) => {
        let id = msg.selected[0]._id;
        let team = TeamArray[id];
        let unit = UnitArray[team.unitID];
        let needed = 4;
        if (team.special.includes("Jump Jet")) {
            needed = 3;
        }
        let order;
        SetupCard(unit.name,"Needing: " + needed + "+",unit.nation);
        if (state.TY.step !== "Artillery and Air") {
            outputCard.body.push("Aircraft can only enter during the Artillery and Air Step");
            PrintCard();
            return;
        }
        let roll = randomInteger(6);
        outputCard.body.push("Roll: " + DisplayDice(roll,team.nation,36));
        if (roll >= needed) {
           outputCard.body.push("The Unit may enter the Battlefield this turn");
           outputCard.body.push("The Aircraft may move anywhere on the Battlefield, keeping in formation");
           order = "Tactical";
        } else {
           outputCard.body.push("[#ff0000]The Unit is Refuelling/Refitting this turn[/#]");
           order = "Hold"
        }
        _.forEach(unit.teamIDs,id => {
            let team = TeamArray[id];
            team.addCondition(order);
            team.order = order;
        })
        unit.order = order;
        TeamArray[unit.teamIDs[0]].token.set("aura1_color",Colours.black);
        PrintCard();
    }
    
    const PlaceTurnMarker = (num) => {
        let turnMarker = getCleanImgSrc(TurnMarkers[state.TY.turn]);        
        let x = Math.floor(((pageInfo.width * num) + edgeArray[num]) / 2);
        let y = Math.floor((pageInfo.height/2));
        let newToken = createObj("graphic", {   
            left: x,
            top: y,
            width: 210, 
            height: 210,  
            name: "Turn",
            pageid: Campaign().get("playerpageid"),
            imgsrc: turnMarker,
            layer: "map",
        });
        toFront(newToken);
        state.TY.turnMarkerIDs[num] = newToken.id;
    }

    const TestKill = (msg) => {
        let id = msg.selected[0]._id;
        let team = TeamArray[id];
        log("Kill: " + team.name);
        team.kill();
    }

    const FlipGraphic = (angle,tok,team) => {
        let rot;
        let flip = false;
        angle = Angle(angle);
        if (team.type === "Infantry") {
            rot = 0;
        } else {
            rot = angle;
        }
        if (angle > 180 && angle <= 360) {
            flip = true;
        }
    
        tok.set({
            rotation: rot,
            fliph: flip,
        });
    }

    const MovementSound = (team) => {
        let sounds = {
            "Wheeled": "Wheeled",
            "Tracked": "Tracked",
            "Halftrack": "Tracked",
            "Leg": "March",
            "Aircraft": "Jet",
            "Helicopter": "Helicopter",
        }
        let sound = sounds[team.movementType];
        PlaySound(sound);
    }
 




    const changeGraphic = (tok,prev) => {
        if (tok.get('subtype') === "token" && tok.get("layer") !== "map") {
            RemoveLines();
            log(tok.get("name") + " moving");
            if ((tok.get("left") !== prev.left) || (tok.get("top") !== prev.top) || tok.get("rotation") !== prev.rotation) {
                let team = TeamArray[tok.id];
                let newLocation = new Point(tok.get("left"),tok.get("top"));
                let newHex = pointToHex(newLocation);
                let newHexLabel = newHex.label();
                newLocation = hexToPoint(newHex); //centres it in hex
                tok.set({
                    left: newLocation.x,
                    top: newLocation.y,
                });

                if (!team) {return};

                let unit = UnitArray[team.unitID];
                let unitLeader;
                if (unit) {
                    unitLeader = TeamArray[unit.teamIDs[0]];
                } else {
                    unitLeader = team;
                }

                let oldHexLabel = team.hexLabel;

                let moveBack = team.bailed;
                if ((team.type === "Tank" || team.type === "Unarmoured Tank") && hexMap[newHexLabel].dash === 3) {
                    moveBack = true;
                }
                if (hexMap[newHexLabel].dash === 4) {
                    moveBack = true;
                }
                if (team.queryCondition("Spot") === true) {
                    moveBack = true;
                }

                let ccError = InCC(team,newHex);
                if (moveBack === true || ccError === true) {
                    PlaySound("No");
                    tok.set("height",prev.height);
                    tok.set("width",prev.width);
                    tok.set("left",prev.left);
                    tok.set("top",prev.top);
                    tok.set("rotation",prev.rotation);
                    return;
                }

                team.hex = newHex;
                team.hexLabel = newHexLabel;
                team.location = newLocation;
                let index = hexMap[oldHexLabel].teamIDs.indexOf(tok.id);
                if (index > -1) {
                    hexMap[oldHexLabel].teamIDs.splice(index,1);
                }
                hexMap[newHexLabel].teamIDs.push(tok.id);
                team.CheckIC();
                //let theta = oldHex.angle(newHex);
                //tok.set("rotation",theta);
                FlipGraphic(tok.get("rotation"),tok,team);
                MovementSound(team);

                if (state.TY.passengers[tok.id]) {
                    //carrying passengers
                    let passengers = state.TY.passengers[tok.id];
                    for (let p=0;p<passengers.length;p++) {
                        let passengerTeam = TeamArray[passengers[p]];
                        passengerTeam.token.set({
                            left: newLocation.x,
                            top: newLocation.y,
                        })
                        passengerTeam.hex = newHex;
                        passengerTeam.hexLabel = newHexLabel;
                        passengerTeam.location = newLocation;
                        let index = hexMap[oldHexLabel].teamIDs.indexOf(passengerTeam.id);
                        if (index > -1) {
                            hexMap[oldHexLabel].teamIDs.splice(index,1);
                        }
                        hexMap[newHexLabel].teamIDs.push(passengerTeam.id);
                    }
                }

                if (state.TY.turn > 0) {
                    if (team.hexLabel !== team.prevHexLabel) {
                        if (team.moved === false) {
                            team.moved = true;
                            let dist = team.hex.distance(team.prevHex);
                            if (dist > 5) {
                                team.maxTact = true;
                            }
                        }
                    } else if (team.hexLabel === team.prevHexLabel) {
                        if (team.moved === true) {
                            team.moved = false;
                            team.maxTact = false;
                        }
                    }
     
                    if (team.moved === true) {
                        RemoveRangedInMarker(team.unitID);
                    }
                }
            
                if (hexMap[team.prevHexLabel].terrain.includes("Offboard") && hexMap[newHexLabel].terrain.includes("Offboard") === false) {
                    unit.inReserve = false;
                    if (unit.order === "") {
                        unitLeader.token.set("aura1_color",Colours.green);
                    }
                } 

            };
/*
            if ((tok.get("height") !== prev.height || tok.get("width") !== prev.width) && state.CoC.labmode === false) {
                let team = TeamArray[tok.id];
                if (!team) {return};
                tok.set("height",prev.height);
                tok.set("width",prev.width);
            }
*/

        };
    };

    const handleInput = (msg) => {
        if (msg.type !== "api") {
            return;
        }
        let args = msg.content.split(";");
        log(args);
        switch(args[0]) {
            case '!Dump':
                log("STATE");
                log(state.TY);
                log("Terrain Array");
                log(TerrainArray);
                log("Hex Map");
                log(hexMap);
                log("Team Array");
                log(TeamArray);
                log("Unit Array");
                log(UnitArray);
                log("Formation Array");
                log(FormationArray);
                log("Ranged In Array");
                log(RangedInArray)
                log("CC Team IDs");
                log(CCTeamIDs);
                break;
            case '!TokenInfo':
                TokenInfo(msg);
                break;
            case '!ClearState':
                ClearState();
                break;
            case '!Roll':
                RollD6(msg);
                break;
            case '!UnitCreation':
                UnitCreation(msg);
                break;
            case '!UnitCreation2':
                UnitCreation2(msg);
                break;
            case '!TestLOS':
                TestLOS(msg);
                break;
            case '!SetupGame':
                SetupGame(msg);
                break;
            case '!GM':
                GM();
                break;
            case '!Activate':
                ActivateUnit(msg);
                break;
            case '!SpecialOrders':
                SpecialOrders(msg);
                break;
            case '!AddAbilities':
                AddAbilities(msg);
                break;
            case '!Cross':
                Cross(msg);
                break;
            case '!AdvanceStep':
                AdvanceStep();
                break;
            case '!RemountChecks':
                RemountChecks();
                break;
            case '!RallyChecks':
                RallyChecks();
                break;
            case '!FieldPromotions':
                FieldPromotions();
                break;
            case '!MoraleChecks':
                MoraleChecks();
                break;
            case '!RollD6':
                RollD6(msg);
                break;        
            case '!Shooting':
                Shooting(msg);
                break;    
            case '!CreateBarrages':
                CreateBarrages(msg);
                break;
            case '!BarrageLOS':
                BarrageLOS(msg);
                break;
            case '!Artillery':
                Artillery(msg);
                break;
            case '!PlaceRangedIn':
                PlaceRangedIn(msg);
                break;
            case '!FinalizeRangedIn':
                FinalizeRangedIn(msg);
                break;
            case '!CloseCombat':
                CloseCombat(msg);
                break;
            case '!CloseCombatTwo':
                CloseCombatTwo(msg);
                break;
            case '!PlaceInReserve':
                PlaceInReserve(msg);
                break;
            case '!PlaceInFoxholes':
                PlaceInFoxholes(msg);
                break;
            case '!Mount':
                Mount(msg);
                break;
            case '!DismountPassengers':
                Dismount(msg);
                break;
            case '!Test':
                Test(msg);
                break;
            case '!EndFire':
                EndFire(msg);
                break;
            case '!SizeHex':
                SizeHex(msg);
                break;
            case '!EnterAircraft':
                EnterAircraft(msg);
                break;
            case '!Kill':
                TestKill(msg);
                break;
            case '!BreakOff':
                BreakOff(msg);
                break;
        }
    };

















    const registerEventHandlers = () => {
        on('chat:message', handleInput);
        on('change:graphic',changeGraphic);
        //on('destroy:graphic',destroyGraphic);
    };

    on('ready', () => {
        log("===> Team Yankee V2 <===");
        log("===> Alternate Activation / Platoons <===");
        log("===> Software Version: " + version + " <===");
        LoadPage();
        BuildMap();
        registerEventHandlers();
        sendChat("","API Ready, Map Loaded")
        log("On Ready Done")
    });
    return {
        // Public interface here
    };
})();
