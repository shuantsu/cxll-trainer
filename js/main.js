$('#loader').fadeOut();

const SRVisualizer = window['sr-visualizer'];

let set = "o";

function change_set(val) {
    set = val;
    generate_random_algs();
}

function embaralhar(array) {
    var indice_atual = array.length,
        valor_temporario, indice_aleatorio;

    while (0 !== indice_atual) {

        indice_aleatorio = Math.floor(Math.random() * indice_atual);
        indice_atual -= 1;

        valor_temporario = array[indice_atual];
        array[indice_atual] = array[indice_aleatorio];
        array[indice_aleatorio] = valor_temporario;
    }

    return array;
}

const epll = `R2 U2 R2 U2 R2 U R2 U2 R2 U2 R2
R2 U' R' U' R U R U R U' R
R2 U' R' U' R U R U R U' R U
R2 U' R' U' R U R U R U' R U'
R2 U' R' U' R U R U R U' R U2
R' U R' U' R' U' R' U R U R2
R' U R' U' R' U' R' U R U R2 U
R' U R' U' R' U' R' U R U R2 U'
R' U R' U' R' U' R' U R U R2 U2
R' U' R2 U R U R' U' R U R U' R U' R'
R' U' R2 U R U R' U' R U R U' R U' R' U`;

const sune = `R U R' U R U2 R'
U' R U R' U R U' R D R' U' R D' R2
U2 R U R' U R2 D R' U2 R D' R2
F' R U2 R' U2 R' F2 R U R U' R' F'
L' R U R' U' L U2 R U2 R'
R U' L' U R' U' L`.split('\n');

const antisune = `R' U' R U' R' U2 R
U2 R U2 R' U2 L' U R U' R' L
U2 R2 D R' U R D' R' U R' U' R U' R'
R' U L U' R U L'
U2 L' U R U' L U R'
R U' R' U2 R U' R' U2 R' D' R U R' D R`.split('\n');

const chameleon = `B' R' U' R U' B L' B L B2 U2 B
R' U R2 D L' B2 L D' R2 U' R
R' U R U2 L' R' U R U' L
F R2 F L2 F' R2 F L2 F2
B L F' L' B' L F L'
L F L' B L F' L' B'`.split('\n');

const headlights = `B U L' B D' B D B2 L2 U' L' B'
L U2 L' F' U L U L' U' F
L2 F2 L B2 L' F2 L B2 L
L' U L U' F R' F R F2 L F' L' F
R2 D' R U2 R' D R U2 R
L2 D R' F2 R D' L' U2 L'`.split('\n');

const bowtie = `R F' D2 F R' U2 R F' D2 F R'
L' B L F' L' B' L F
B' U2 B' D' B U2 B' D B2
L U2 L D R' F2 R D' L2
B L' B' R B L B' R'
R' F2 L D' L D L2 F2 R`.split('\n');

const double_sune = `R B2 R2 U2 R B2 R' U2 R2 B2 R'
B U B' U B U' B' U B U2 B'
L' U2 L2 F' U L2 U L2 U' F U' L'
F' U' F U' F' U' B U' F U B'`.split('\n');

const bruno = `R U2 R2 U' R2 U' R2 U2 R
R F' U' R2 F U' F' U R2 U F R'
R' U L U' R U' L' U' L U' L'
R' F2 U F2 U' F2 U' L' R U2 L
L U2 L' B L' B R B R' B2 L B'
L' U2 L F' L F' R' F' R F2 L' F`.split('\n');

const oriented = `L U' R' U L' U2 R U' R' U2 R
R' U' R U' L R U2 R' U' R U2 L' U R2 U R`.split('\n');

const the_algs = {
    'o': oriented,
    's': sune,
    'as': antisune,
    't': chameleon,
    "u": headlights,
    "pi": bruno,
    "h": double_sune,
    "l": bowtie,
}

const epll_list = epll.split('\n');

Cube.initSolver();

function solve(x) {

    var c = new Cube();
    c.move(x);
    return c.solve();

}

const moves = ['', "U'", "U2", "U"];

let random_orientation = false;

if (localStorage.getItem('random_orientation')) random_orientation = 'true' == localStorage.getItem('random_orientation');

$('#random_orientation').prop('checked', random_orientation);

function fancy_hide(list) {
    let n = 0;
    let f = 100;
    let t = list.length;
    $.each(list, function(idx, el) {
        window.setTimeout(function() {
            $(el).addClass('fancy-hide');
        }, ((t * n) - (n)) + (n * f));
        n += 1;
    });
}

function fancy_show(list) {
    let n = 0;
    let f = 100;
    let t = list.length;
    $.each(list, function(idx, el) {
        window.setTimeout(function() {
            $(el).removeClass('fancy-hide');
        }, ((t * n) - (n)) + (n * f));
        n += 1;
    });
}

$('#random_orientation').change(function() {
    random_orientation = $(this)[0].checked;
    localStorage.setItem('random_orientation', random_orientation);
    if (random_orientation) {
        fancy_hide($('.ocll_wrapper'));
    } else {
        fancy_show($('.ocll_wrapper'));
    }
});

let premove = {
    "o": 0,
    "s": 0,
    "as": 0,
    "t": 0,
    "u": 0,
    "pi": 0,
    "h": 0,
    "l": 0,
}

let rotation = {
    "o": 0,
    "s": 0,
    "as": 0,
    "t": 0,
    "u": 0,
    "pi": 0,
    "h": 0,
    "l": 0,
}

if (localStorage.getItem('premove')) {
    premove = JSON.parse(localStorage.getItem('premove'));
    for (let alg_set in premove) {
        premove[alg_set] %= 4;
    }
}

function generate_random_algs() {
    const cll_list_copy = the_algs[set];
    embaralhar(cll_list_copy);
    document.getElementById('output').innerHTML = "";
    cll_list_copy.forEach(alg => {
        const rand = epll_list[Math.floor(Math.random() * epll_list.length)];
        const rand2 = random_orientation ? moves[Math.floor(Math.random() * moves.length)] : "";
        const scramble = rand2 + ' ' + moves[premove[set] % 4] + " " + alg + ' ' + rand;
        const final_move = solve(scramble);
        const el = document.createElement('div');
        const img_wrapper = document.createElement('div');
        $(img_wrapper).addClass('img');
        SRVisualizer.cubePNG(img_wrapper, `visualcube.php?stage=cll&fmt=svg&size=150&view=plan&alg=${final_move}`)
        el.classList.add('alg');
        document.getElementById('output').appendChild(el);
        el.appendChild(img_wrapper);
        $('<div/>', {
            "class": 'setup'
        }).text(final_move).appendTo(el);
    });
    $("html, body").animate({
        scrollTop: 0
    }, 200);
}

$(':radio').change(function() {
    $('.active-radio').removeClass("active-radio");
    $(this).closest('label').addClass('active-radio');
});

$(document).on('click', '.alg', function() {
    $('.active').removeClass('active');
    $(this).addClass('active');
});

$('body').css('marginTop', $('#sets').innerHeight());

$("#close").click(function() {
    $("#modal").fadeOut()
});

document.getElementById('butt').onclick = generate_random_algs;

$('[type="radio"]:checked').closest('label').addClass('active-radio');

generate_random_algs();

for (let alg_set in the_algs) {
    if (alg_set != 'o') {
        const final_move = solve(moves[premove[alg_set] % 4] + " " + the_algs[alg_set][0]);
        const el = document.createElement('div');
        const el_wrapper = document.createElement('div');
        el.setAttribute('class', 'ocll');
        el.setAttribute('data-name', alg_set);
        el_wrapper.appendChild(el);
        el_wrapper.setAttribute('class', 'ocll_wrapper');
        document.getElementById('ocll-options').appendChild(el_wrapper);
        SRVisualizer.cubePNG(el, `visualcube.php?stage=oll&fmt=svg&size=150&view=plan&alg=${final_move}`);
    }
}

function showOptions() {
    $('#modal').fadeIn();
}

$(document).on('click', '.ocll', function() {
    const set_name = $(this).data('name');
    premove[set_name] += 1;
    rotation[set_name] += 90;
    $(this).css('transform', 'rotate(' + rotation[set_name] + 'deg)');
    localStorage.setItem('premove', JSON.stringify(premove));
});

if (random_orientation) {
    $('.ocll_wrapper').addClass('fancy-hide');
}