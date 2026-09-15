export class FincasView {

    constructor(
        mainContent,
        fincaService,
        parcelaService
    ) {

        this.mainContent =
            mainContent;

        this.fincaService =
            fincaService;

        this.parcelaService =
            parcelaService;

    }


    mostrar() {

        const fincas =
            this.fincaService.obtenerTodas();


        let superficieTotal = 0;
        let parcelasTotales = 0;


        fincas.forEach(finca => {

            superficieTotal +=
                Number(finca.superficie);

            parcelasTotales +=
                finca.parcelas.length;

        });


        this.mainContent.innerHTML = `

            <header class="topbar">

                <div>

                    <h2>
                        Fincas y parcelas
                    </h2>

                    <p>
                        Gestiona las fincas de tu explotación
                    </p>

                </div>


                <button
                    id="nuevaFinca"
                    class="primary-button"
                >
                    + Nueva finca
                </button>

            </header>


            <section class="stats finca-stats">

                <div class="card">

                    <span class="card-icon">
                        🌾
                    </span>

                    <div>

                        <p>Fincas</p>

                        <h3>
                            ${fincas.length}
                        </h3>

                    </div>

                </div>


                <div class="card">

                    <span class="card-icon">
                        🗺️
                    </span>

                    <div>

                        <p>Parcelas</p>

                        <h3>
                            ${parcelasTotales}
                        </h3>

                    </div>

                </div>


                <div class="card">

                    <span class="card-icon">
                        📐
                    </span>

                    <div>

                        <p>
                            Superficie total
                        </p>

                        <h3>
                            ${superficieTotal.toFixed(2)} ha
                        </h3>

                    </div>

                </div>

            </section>


            <div id="listaFincas"></div>

        `;


        document
            .getElementById("nuevaFinca")
            .addEventListener(
                "click",
                () => this.mostrarFormulario()
            );


        this.mostrarLista();

    }


    mostrarLista() {

        const contenedor =
            document.getElementById(
                "listaFincas"
            );


        const fincas =
            this.fincaService.obtenerTodas();


        if (fincas.length === 0) {

            contenedor.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        🌾
                    </div>

                    <h3>
                        Todavía no tienes ninguna finca
                    </h3>

                    <p>
                        Crea tu primera finca para empezar.
                    </p>

                </div>

            `;

            return;
        }


        contenedor.innerHTML = `

            <div class="fincas-grid">

                ${fincas.map(finca => `

                    <div class="finca-card">

                        <div class="finca-card-top">

                            <span class="finca-icon">
                                🌾
                            </span>


                            <button
                                class="delete-button eliminar-finca"
                                data-id="${finca.id}"
                            >
                                ×
                            </button>

                        </div>


                        <h3>
                            ${finca.nombre}
                        </h3>


                        <p class="finca-location">

                            📍 ${finca.ubicacion || "Sin ubicación"}

                        </p>


                        <div class="finca-info">

                            <div>

                                <span>
                                    Superficie
                                </span>

                                <strong>
                                    ${finca.superficie} ha
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Parcelas
                                </span>

                                <strong>
                                    ${finca.parcelas.length}
                                </strong>

                            </div>

                        </div>


                        <button
                            class="secondary-button ver-finca"
                            data-id="${finca.id}"
                        >
                            Ver finca
                        </button>

                    </div>

                `).join("")}

            </div>

        `;


        document
            .querySelectorAll(".ver-finca")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        this.mostrarDetalle(
                            Number(button.dataset.id)
                        );

                    }
                );

            });


        document
            .querySelectorAll(".eliminar-finca")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            Number(button.dataset.id);


                        if (
                            !confirm(
                                "¿Quieres eliminar esta finca?"
                            )
                        ) {

                            return;

                        }


                        const resultado =
                            this.fincaService
                                .eliminar(id);


                        if (
                            resultado
                            &&
                            resultado.ok === false
                        ) {

                            alert(
                                resultado.mensaje
                                ||
                                "No se ha podido eliminar la finca."
                            );

                            return;

                        }


                        this.mostrar();

                    }
                );

            });

    }


    mostrarFormulario() {

        this.mainContent.innerHTML = `

            <header class="topbar">

                <div>
                    <h2>Nueva finca</h2>
                    <p>Añade una finca a GestaCamps</p>
                </div>

            </header>


            <div class="form-panel">

                <div class="form-group">

                    <label>
                        Nombre de la finca *
                    </label>

                    <input
                        id="nombreFinca"
                        type="text"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Ubicación
                    </label>

                    <input
                        id="ubicacionFinca"
                        type="text"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Superficie total (ha) *
                    </label>

                    <input
                        id="superficieFinca"
                        type="number"
                        min="0"
                        step="0.01"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Notas
                    </label>

                    <textarea
                        id="notasFinca"
                        rows="5"
                    ></textarea>

                </div>


                <div class="form-actions">

                    <button
                        id="cancelarFinca"
                        class="secondary-button"
                    >
                        Cancelar
                    </button>


                    <button
                        id="guardarFinca"
                        class="primary-button"
                    >
                        Guardar finca
                    </button>

                </div>

            </div>

        `;


        document
            .getElementById("cancelarFinca")
            .addEventListener(
                "click",
                () => this.mostrar()
            );


        document
            .getElementById("guardarFinca")
            .addEventListener(
                "click",
                () => {

                    const nombre =
                        document
                            .getElementById("nombreFinca")
                            .value
                            .trim();

                    const ubicacion =
                        document
                            .getElementById("ubicacionFinca")
                            .value
                            .trim();

                    const superficie =
                        Number(
                            document
                                .getElementById("superficieFinca")
                                .value
                        );

                    const notas =
                        document
                            .getElementById("notasFinca")
                            .value
                            .trim();


                    if (!nombre) {

                        alert(
                            "Introduce el nombre de la finca."
                        );

                        return;
                    }


                    if (superficie <= 0) {

                        alert(
                            "Introduce una superficie válida."
                        );

                        return;
                    }


                    this.fincaService.crear(
                        nombre,
                        ubicacion,
                        superficie,
                        notas
                    );


                    this.mostrar();

                }
            );

    }


    mostrarDetalle(fincaId) {

        const finca =
            this.fincaService.obtenerPorId(
                fincaId
            );


        if (!finca) {
            return;
        }


        this.mainContent.innerHTML = `

            <div class="detail-header">

                <button
                    id="volverFincas"
                    class="back-button"
                >
                    ← Volver
                </button>


                <div class="detail-title">

                    <div>

                        <h2>
                            ${finca.nombre}
                        </h2>

                        <p>
                            📍 ${finca.ubicacion || "Sin ubicación"}
                        </p>

                    </div>


                    <button
                        id="nuevaParcela"
                        class="primary-button"
                    >
                        + Nueva parcela
                    </button>

                </div>

            </div>


            <section class="stats finca-stats">

                <div class="card">

                    <span class="card-icon">
                        📐
                    </span>

                    <div>

                        <p>Superficie</p>

                        <h3>
                            ${finca.superficie} ha
                        </h3>

                    </div>

                </div>


                <div class="card">

                    <span class="card-icon">
                        🗺️
                    </span>

                    <div>

                        <p>Parcelas</p>

                        <h3>
                            ${finca.parcelas.length}
                        </h3>

                    </div>

                </div>

            </section>


            <div class="section-header">

                <h2>Parcelas</h2>

                <p>
                    Parcelas pertenecientes a esta finca.
                </p>

            </div>


            <div id="listaParcelas"></div>

        `;


        document
            .getElementById("volverFincas")
            .addEventListener(
                "click",
                () => this.mostrar()
            );


        document
            .getElementById("nuevaParcela")
            .addEventListener(
                "click",
                () => this.mostrarFormularioParcela(fincaId)
            );


        this.mostrarParcelas(finca);

    }


    mostrarParcelas(finca) {

        const contenedor =
            document.getElementById(
                "listaParcelas"
            );


        if (finca.parcelas.length === 0) {

            contenedor.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        🗺️
                    </div>

                    <h3>No hay parcelas</h3>

                    <p>
                        Añade la primera parcela.
                    </p>

                </div>

            `;

            return;
        }


        contenedor.innerHTML = `

            <div class="parcelas-grid">

                ${finca.parcelas.map(parcela => `

                    <div class="parcela-card">

                        <div class="parcela-header">

                            <div>

                                <h3>
                                    🗺️ ${parcela.nombre}
                                </h3>

                                <p>
                                    ${parcela.superficie} ha
                                </p>

                            </div>


                            <button
                                class="delete-button eliminar-parcela"
                                data-id="${parcela.id}"
                            >
                                ×
                            </button>

                        </div>


                        <div class="parcela-data">

                            <span>
                                Cultivo
                            </span>

                            <strong>
                                ${parcela.cultivo || "Sin cultivo asignado"}
                            </strong>

                        </div>

                    </div>

                `).join("")}

            </div>

        `;


        document
            .querySelectorAll(".eliminar-parcela")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        if (
                            confirm(
                                "¿Quieres eliminar esta parcela?"
                            )
                        ) {

                            this.parcelaService.eliminar(
                                finca.id,
                                Number(button.dataset.id)
                            );

                            this.mostrarDetalle(
                                finca.id
                            );

                        }

                    }
                );

            });

    }


    mostrarFormularioParcela(fincaId) {

        const finca =
            this.fincaService.obtenerPorId(
                fincaId
            );


        this.mainContent.innerHTML = `

            <header class="topbar">

                <div>

                    <h2>Nueva parcela</h2>

                    <p>
                        ${finca.nombre}
                    </p>

                </div>

            </header>


            <div class="form-panel">

                <div class="form-group">

                    <label>
                        Nombre *
                    </label>

                    <input
                        id="nombreParcela"
                        type="text"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Superficie (ha) *
                    </label>

                    <input
                        id="superficieParcela"
                        type="number"
                        min="0"
                        step="0.01"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Referencia SIGPAC
                    </label>

                    <input
                        id="sigpacParcela"
                        type="text"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Notas
                    </label>

                    <textarea
                        id="notasParcela"
                        rows="5"
                    ></textarea>

                </div>


                <div class="form-actions">

                    <button
                        id="cancelarParcela"
                        class="secondary-button"
                    >
                        Cancelar
                    </button>


                    <button
                        id="guardarParcela"
                        class="primary-button"
                    >
                        Guardar parcela
                    </button>

                </div>

            </div>

        `;


        document
            .getElementById("cancelarParcela")
            .addEventListener(
                "click",
                () => this.mostrarDetalle(fincaId)
            );


        document
            .getElementById("guardarParcela")
            .addEventListener(
                "click",
                () => {

                    const nombre =
                        document
                            .getElementById("nombreParcela")
                            .value
                            .trim();

                    const superficie =
                        Number(
                            document
                                .getElementById("superficieParcela")
                                .value
                        );

                    const sigpac =
                        document
                            .getElementById("sigpacParcela")
                            .value
                            .trim();

                    const notas =
                        document
                            .getElementById("notasParcela")
                            .value
                            .trim();


                    if (!nombre || superficie <= 0) {

                        alert(
                            "Introduce nombre y superficie válidos."
                        );

                        return;
                    }


                    const resultado =
                        this.parcelaService.crear(
                            fincaId,
                            nombre,
                            superficie,
                            sigpac,
                            notas
                        );


                    if (!resultado.ok) {

                        alert(
                            resultado.mensaje
                        );

                        return;
                    }


                    this.mostrarDetalle(
                        fincaId
                    );

                }
            );

    }

}