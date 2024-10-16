// Evento para executar o algoritmo Fillpoly.
button_fillpoly.addEventListener('click', () => {
    const selected_poligono_index = poligonos_salvos.value;
    let aresta_scanlines, dx = 0, dy = 0, Tx = 0, ymin = [], Px = 0;

    if (!isNaN(selected_poligono_index) && selected_poligono_index != '') {
        console.log(`POLIGONO SELECIONADO: ${selected_poligono_index}`);

        // Armazena os vertices do poligono selecionado.
        const selected_poligono = array_poligonos[parseInt(selected_poligono_index)].array_vertices;
        // Calculando total de scanlines do poligono.
        const total_scanlines = calculateScanlines(selected_poligono, ymin);
        // Array para as intersecoes.
        let array_listas_scanline = Array(total_scanlines).fill(null).map(() => []);

        console.log(`TOTAL DE SCANLINES: ${total_scanlines}`);

        // Calculando total de scanlines de cada aresta.
        for (let i = 0; i <= selected_poligono.length - 1; i++) {
            dx = 0, dy = 0, Tx = 0, Px = 0;
            aresta_scanlines = calculateArestaScanlines(selected_poligono, i);

            console.log("NUMERO DE SCANLINES DA ARESTA: ");
            console.log(aresta_scanlines);

            // dx, dy, Px
            if (i == selected_poligono.length - 1) {
                // AB
                if (selected_poligono[i].coordinate_x < selected_poligono[0].coordinate_x) {
                    dx = selected_poligono[0].coordinate_x - selected_poligono[i].coordinate_x;
                    dy = selected_poligono[0].coordinate_y - selected_poligono[i].coordinate_y;
                    Px = selected_poligono[i].coordinate_x;
                } else {
                    // BA
                    dx = selected_poligono[i].coordinate_x - selected_poligono[0].coordinate_x;
                    dy = selected_poligono[i].coordinate_y - selected_poligono[0].coordinate_y;
                    Px = selected_poligono[0].coordinate_x;
                }
            } else {
                // AB
                if (selected_poligono[i].coordinate_x < selected_poligono[i + 1].coordinate_x) {
                    dx = selected_poligono[i + 1].coordinate_x - selected_poligono[i].coordinate_x;
                    dy = selected_poligono[i + 1].coordinate_y - selected_poligono[i].coordinate_y;
                    Px = selected_poligono[i].coordinate_x;
                } else {
                    // BA
                    dx = selected_poligono[i].coordinate_x - selected_poligono[i + 1].coordinate_x;
                    dy = selected_poligono[i].coordinate_y - selected_poligono[i + 1].coordinate_y;
                    Px = selected_poligono[i + 1].coordinate_x;
                }
            }

            // Taxa de incremento em x
            Tx = (dx / dy);

            // Processando cada scanline da aresta.
            // ymin -> ymax - 1
            for (let j = 0; j < aresta_scanlines - 1; j++) {
                // Armazenando as intersecoes.
                array_listas_scanline[parseInt(j - parseInt(ymin))].push(Px);
                // Incrementando o x.
                Px = Px + Tx;
            }
        }

    } else {
        alert("Nenhum poligono selecionado!");
    }
});