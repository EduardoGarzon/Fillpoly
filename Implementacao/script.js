// ------------------------------------------------------------------------------------------------------------
const canvas = document.getElementById('window-div');
const context = canvas.getContext('2d');

let array_vertices = [];
let array_poligonos = [];
let flag_novo_poligono = false;

const button_change_window_color = document.getElementById('button-change-window-color');
const button_novo_poligono = document.getElementById('button-novo-poligono');
const button_salvar_poligono = document.getElementById('button-salvar-poligono');
const button_fillpoly = document.getElementById('button-fillpoly');
const button_limpar_tela = document.getElementById('button-limpar-tela');
const button_excluir_poligono = document.getElementById('button-excluir-poligono');

const aresta_color_picker = document.getElementById('aresta-color-picker');
const poligono_color_picker = document.getElementById('poligono-color-picker');

const poligonos_salvos = document.getElementById('poligonos');
// ------------------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------------------

// Evento para alternar os temas da janela do Canva.
button_change_window_color.addEventListener('click', () => {
    if (canvas.style.backgroundColor == "rgb(0, 0, 0)") {
        canvas.style.backgroundColor = "#FFFFFF";
        button_change_window_color.innerHTML = "Change to Black";
    } else {
        canvas.style.backgroundColor = "#000000";
        button_change_window_color.innerHTML = "Change to White";
    }
});

// Evento para iniciar novo polígono.
button_novo_poligono.addEventListener('click', (e) => {
    window.alert("Novo Poligono pode ser desenhado.");

    flag_novo_poligono = true;
    aresta_color_picker.value = "#FFFF00";
});

// Evento para salvar o poligono desenhado.
button_salvar_poligono.addEventListener('click', (e) => {
    if (array_vertices.length >= 3) {
        flag_novo_poligono = false;

        // Fecha o polígono.
        drawLine(array_vertices[array_vertices.length - 1], array_vertices[0], array_vertices[array_vertices.length - 1].aresta_color);

        console.log("ARRAY DE VERTICES:");
        console.log(array_vertices);

        // Armazena o polígono.
        const poligono_color = canvas.style.backgroundColor == "rgb(0, 0, 0)" ? "#000000" : "#FFFFFF";
        let flag_poligono_colorido = false;
        array_poligonos.push({ array_vertices, poligono_color, flag_poligono_colorido });
        array_vertices = [];

        // Adiciona o novo polígono na lista de polígonos da interface.
        const option = document.createElement('option');
        option.value = array_poligonos.length - 1;
        option.text = `Polígono ${array_poligonos.length}`;
        poligonos_salvos.add(option);

        console.log("ARRAY DE POLIGONOS:");
        console.log(array_poligonos);

        window.alert(`Polígono ${array_poligonos.length} salvo com sucesso!`);
    } else {
        window.alert("Deve ser desenhado no mínimo 3 vértices!");
    }
});

// Evento para limpar toda a janela de desenho.
button_limpar_tela.addEventListener('click', (e) => {
    if (array_vertices.length > 0 || array_poligonos.length > 0) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        if (array_poligonos.length > 0) {
            array_poligonos = [];
            poligonos_salvos.innerHTML = '';
        }

        array_vertices = [];
        aresta_color_picker.value = "#FFFF00";

        console.log("ARRAY DE POLIGONOS E VERTICES: ");
        console.log(array_poligonos, array_vertices);
    } else {
        window.alert("Não existem polígonos desenhados!");
    }
});

// Evento para excluir um polígono.
button_excluir_poligono.addEventListener('click', (e) => {
    if (array_poligonos.length > 0) {
        const poligono_excluido_index = parseInt(poligonos_salvos.value);

        poligonos_salvos.remove(poligono_excluido_index);
        array_poligonos.splice(poligono_excluido_index, 1);

        const options = Array.from(poligonos_salvos);
        options.forEach((e, i) => {
            e.value = i;
            e.innerHTML = `Polígono ${i + 1}`;
        });

        context.clearRect(0, 0, canvas.width, canvas.height);

        if (array_poligonos.length > 0) {
            for (let i = 0; i < array_poligonos.length; i++) {
                for (let j = 0; j <= array_poligonos[i].array_vertices.length - 1; j++) {
                    if (j == (array_poligonos[i].array_vertices.length - 1)) {
                        drawLine(array_poligonos[i].array_vertices[j], array_poligonos[i].array_vertices[0], array_poligonos[i].array_vertices[j].aresta_color);
                    } else {
                        drawLine(array_poligonos[i].array_vertices[j], array_poligonos[i].array_vertices[j + 1], array_poligonos[i].array_vertices[j].aresta_color);
                    }
                }

                if (array_poligonos[i].flag_poligono_colorido == true) {
                    fillpolyScanline(parseInt(i), array_poligonos[i].poligono_color);
                }
            }
        } else {
            aresta_color_picker.value = "#FFFF00";
        }

        console.log("INDEX DO POLIGONO EXCLUIDO:");
        console.log(poligono_excluido_index);

        console.log("ARRAY DE POLIGONOS: ");
        console.log(array_poligonos);
    } else {
        window.alert("Não existem polígonos para excluir!");
    }
});

// Evento para executar o algoritmo Fillpoly.
button_fillpoly.addEventListener('click', () => {
    const selected_poligono_index = poligonos_salvos.value;

    fillpolyScanline(parseInt(selected_poligono_index), poligono_color_picker.value);
});

// ------------------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------------------

// Evento para captura dos cliques do mouse na janela.
canvas.addEventListener('click', (e) => {
    if (flag_novo_poligono == true) {
        // Armazenando coordenadas x e y.
        const coordinate_x = e.offsetX;
        const coordinate_y = e.offsetY;

        // Armazenando coordenadas do vértice e sua cor.
        const aresta_color = aresta_color_picker.value;
        array_vertices.push({ coordinate_x, coordinate_y, aresta_color });

        // Desenhando aresta.
        if (array_vertices.length > 1) {
            const previous_vertice = array_vertices[array_vertices.length - 2];
            const last_vertice = array_vertices[array_vertices.length - 1];
            drawLine(previous_vertice, last_vertice, aresta_color);
        }
    } else {
        window.alert("Selecione o botão: Novo Polígono.");
    }
});

// Procedimento para desenhar a linha da aresta.
function drawLine(previous_vertice, last_vertice, color) {
    let xA = previous_vertice.coordinate_x;
    let yA = previous_vertice.coordinate_y;
    let xB = last_vertice.coordinate_x;
    let yB = last_vertice.coordinate_y;

    // Coeficiente m e Taxa de Incremento em x.
    const dx = xB - xA;
    const dy = yB - yA;
    const Tx = dx / dy;

    console.log("dx, dy e T:");
    console.log(dx, dy, Tx);

    context.strokeStyle = color;
    context.lineWidth = 3;
    context.beginPath();

    // AB
    if (yA < yB) {
        while (yA < yB) {
            context.moveTo(Math.round(xA), Math.round(yA));

            xA += Tx;
            yA += 1;

            context.lineTo(Math.round(xA), Math.round(yA));
        }
        context.stroke();
    } else { // BA
        while (yA > yB) {
            context.moveTo(Math.round(xA), Math.round(yA));

            xA -= Tx;
            yA -= 1;

            context.lineTo(Math.round(xA), Math.round(yA));
        }
        context.stroke();
    }

    context.closePath();
}

// Procedimento para executar o algoritmo das scanlines.
function fillpolyScanline(selected_poligono_index, poligono_color) {
    let vertex_ymin = 0, vertex_ymax = 0, dx = 0, dy = 0, Tx = 0, Px = 0, poligono_ymin = [];
    
    if (!isNaN(selected_poligono_index) && selected_poligono_index != undefined) {
        console.log(`POLIGONO SELECIONADO: ${selected_poligono_index}`);
        
        array_poligonos[parseInt(selected_poligono_index)].poligono_color = poligono_color;
        array_poligonos[parseInt(selected_poligono_index)].flag_poligono_colorido = true;

        // Armazena os vertices do poligono selecionado.
        const selected_poligono = array_poligonos[parseInt(selected_poligono_index)].array_vertices;
        // Calculando total de scanlines do poligono.
        const total_scanlines = calculateScanlines(selected_poligono, poligono_ymin);
        // Array para as intersecoes.
        let array_listas_scanline = Array(total_scanlines).fill(null).map(() => []);
        
        console.log(selected_poligono);
        console.log(`TOTAL DE SCANLINES: ${total_scanlines}`);

        // Cálculo das intersecoes de x.
        for (let i = 0; i <= selected_poligono.length - 1; i++) {
            // dx, dy, Px
            if (i == selected_poligono.length - 1) {
                dx = selected_poligono[0].coordinate_x - selected_poligono[i].coordinate_x;
                dy = selected_poligono[0].coordinate_y - selected_poligono[i].coordinate_y;

                // AB
                if (selected_poligono[i].coordinate_y < selected_poligono[0].coordinate_y) {
                    Px = selected_poligono[i].coordinate_x;
                    vertex_ymax = selected_poligono[0].coordinate_y;
                    vertex_ymin = selected_poligono[i].coordinate_y;
                } else {
                    // BA
                    Px = selected_poligono[0].coordinate_x;
                    vertex_ymax = selected_poligono[i].coordinate_y;
                    vertex_ymin = selected_poligono[0].coordinate_y;
                }

            } else {
                dx = selected_poligono[i + 1].coordinate_x - selected_poligono[i].coordinate_x;
                dy = selected_poligono[i + 1].coordinate_y - selected_poligono[i].coordinate_y;

                // AB
                if (selected_poligono[i].coordinate_y < selected_poligono[i + 1].coordinate_y) {
                    Px = selected_poligono[i].coordinate_x;
                    vertex_ymax = selected_poligono[i + 1].coordinate_y;
                    vertex_ymin = selected_poligono[i].coordinate_y;
                } else {
                    // BA
                    Px = selected_poligono[i + 1].coordinate_x;
                    vertex_ymax = selected_poligono[i].coordinate_y;
                    vertex_ymin = selected_poligono[i + 1].coordinate_y;
                }

            }

            // Taxa de incremento em x.
            if (dy !== 0) {
                Tx = dx / dy;
            } else {
                Tx = 0;  // Aresta horizontal.
            }

            // Percorre todo o eixo y da aresta - 1 e armazena suas intercecoes em x.
            for (let j = vertex_ymin; j <= vertex_ymax - 1; j++) {
                array_listas_scanline[j - poligono_ymin[0]].push(Px);
                Px = Px + Tx;
            }
        }

        // Ordenando os valores das coordenadas x.
        array_listas_scanline.forEach((intersections, index) => {
            if (intersections.length > 0) {
                array_listas_scanline[index] = intersections.sort((a, b) => a - b);
            }
        });
        
        console.log("ARRAY SCANLINES:");
        console.log(array_listas_scanline);
        
        preencherPoligono(array_listas_scanline, poligono_ymin, poligono_color);

        console.log("POLIGONO PREENCHIDO:");
        console.log(array_poligonos[parseInt(selected_poligono_index)]);
    } else {
        alert("Nenhum poligono selecionado!");
    }
}

// Procedimento para calcular o total de scanlines do poligono.
function calculateScanlines(vertices_poligono, poligono_ymin) {
    const Y_values = vertices_poligono.map(obj => obj.coordinate_y);

    const Y_max = Math.max(...Y_values);
    const Y_min = Math.min(...Y_values);

    poligono_ymin.push(Y_min);

    console.log("Y MAX E Y MIN DO POLIGONO:");
    console.log(Y_max, Y_min);

    return (Y_max - Y_min);
};

// Procedimento para preencher a cor no poligono.
function preencherPoligono(array_listas_scanline, poligono_ymin, poligono_color) {
    context.fillStyle = poligono_color;
    context.strokeStyle = poligono_color;
    context.lineWidth = 1;

    array_listas_scanline.forEach((x_intersection, y_index) => {
        if (x_intersection.length > 0) {
            context.beginPath();
            for (let i = 0; i < x_intersection.length; i += 2) {
                const x_ini = x_intersection[i];
                const x_fim = x_intersection[i + 1];

                if (x_ini !== undefined && x_fim !== undefined) {
                    context.fillRect(Math.ceil(x_ini), (y_index + poligono_ymin[0]), Math.floor(x_fim - x_ini), 1);
                    // context.moveTo(Math.ceil(x_ini), y_index + poligono_ymin[0]);
                    // context.lineTo(Math.floor(x_fim), y_index + poligono_ymin[0]);
                }
            }
            context.stroke();
        }
    });

    context.closePath();
}
// ------------------------------------------------------------------------------------------------------------