// 1. Configuración de SUPABASE
const supabase_url = 'https://lcvvqsakkibulfxpyrxe.supabase.co';
const supabase_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjdnZxc2Fra2lidWxmeHB5cnhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5MDE3ODUsImV4cCI6MjA5MTQ3Nzc4NX0.THPiVSpaRsiIS338w4JrUDzfbqyhBbHWzaPH4fBrtn8';
const supabaseClient = supabase.createClient(supabase_url, supabase_key);
const whatsapp_number = "573158643093"; 

console.log("¡Archivo cargado y listo!");

//Variables de estado
let serviciosData = [];
const container = document.getElementById('servicios-container');
const buscador = document.getElementById('buscador');

// Obtener datos de Supabase
async function getServicios() {
    console.log("Consultando tabla Servicios...")
    try {
        const {data, error} = await supabaseClient
        .from('Servicios') //Verifica que sea idéntico al nombre en Supabase
        .select('*')
        .order('Código', {ascending: true}); //Ordenar por código de forma ascendente
        if(error) throw error;

        if(data && data.length > 0) {

        console.log("Datos recibidos:", data);
        serviciosData = data; // Guardar los datos en la variable de estado

        filtrarPorCategoria('Individual');
        //renderizarVitrinaPublica(data);
        filtrarVitrinaPublica('Individual');

    //    renderCards(data); // LLama a la función que crea las tarjetas
    //    console.log("¡Datos enviados a renderizar!");
        }

    } catch (error) {
        console.error('Error al conectar:', error.message);
        container.innerHTML = `<p style="color:red">Error: ${error.message}</p>`;   
        }
}

function generarLinkWhatsapp(item) {
    const costoVendedor = Number(item['Costo Vendedor']).toLocaleString();

    const msg = 
    ' *Nuevo Pedido - Streamflick PRO*\n\n' +
    ' Hola. Solicito la siguiente activación:\n\n' +
    ' *Servicio:* ' + item['Servicio'] + '\n' +
    ' *Costo:* $' + costoVendedor + '\n\n' +
    ' Por favor, confírmame si tienes disponibilidad para proceder a cancelar el valor.\n' +
    ' Quedo pendiente.'; 

    return 'https://wa.me/' + whatsapp_number + '?text=' + encodeURIComponent(msg);
}

function irAVitrinaPublica() {
    // Ocultar panel de vendedores
    const panelVendedores = document.getElementById('main-content');
    if (panelVendedores) {
        panelVendedores.style.display = 'none';
    }

    // Mostrar sección pública
    const seccionPublica = document.getElementById('seccion-publica');
    if (seccionPublica) {
        seccionPublica.style.display = 'block';
    }

    // Asegurar que el botón esté visible
    const botonAccesoVendedores = document.querySelector('.btn-acceso-vendedores');
    if (botonAccesoVendedores) {
        botonAccesoVendedores.style.display = 'inline-block';
    }
}

// Renderizar las tarjetas en HTML sección vendedores 
function renderCards(lista) {
    container.innerHTML = '';

    // Definimos los colores neón para cada categoría
    const colores = {
        'Individual': '#00d2ff', // Cian
        'Dúos': '#9139f5', // Morado
        'Tríos': '#ff007a', // Rosa
        'Combos Especiales': '#ffd700' // Dorado
    };

    console.log("Dibujando " + lista.length + " tarjetas...");

    lista.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        const waLink = generarLinkWhatsapp(item);

        // Lógica para el badge de disponibilidad (solo para categoría Individual)
        let badgeDisponibilidadVendedor = '';

        if (item['Categoría'] === 'Individual' && item['Disponibilidad_servicio']) {
            let claseEstado = item['Disponibilidad_servicio'].toLowerCase();
            badgeDisponibilidadVendedor = `<span class="badgeDisponibilidad-vendedor ${claseEstado}">${item['Disponibilidad_servicio'].toUpperCase()}</span>`;
        }

        // Usamos ${colores[item['Categoría']]} para que el navegador busque el color en el objeto de arriba

        //Estructura con espacio para miniatura de canva
        card.innerHTML = `<div class="card-img-container">
        ${badgeDisponibilidadVendedor}
        <img src="${item.Imagen_URL || 'img/placeholder.png'}" alt="${item.Servicio}" class="card-img">
        </div>

        <div class="card-header">
            <span class="badge" style="background-color: ${colores[item['Categoría']] || '#555'}">
                ${item['Categoría'] || 'General'}
            </span>
            <small style="color:gray">#${item['Código']}</small>
        </div>

        <h3 style="margin:0">${item['Servicio']}</h3> 

        <div class="costo-box">
            <div class="price-row">
                <span>Precio Cliente:</span>
                <span style="color: ${colores[item['Categoría']] || '#fff'}; font-weight: bold;">$
                    ${Number(item['Precio Cliente']).toLocaleString()}</span>
                </div>
                <div class="price-row">
                    <span>Tu Costo:</span>
                    <span>$
                        ${Number(item['Costo Vendedor']).toLocaleString()}</span>
                        </div>
                        
                        
                        <div class="ganancia">
                            <small style="font-weight:normal">Ganas: </small>
                            +$${Number(item['Comisión']).toLocaleString()}
                            </div>

                        <button
                            class="btn-whatsapp" id="wa-${item['Código']}">
                           
                            <svg viewBox="0 0 24 24" fill="white" widthe="16" height="16">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                            Comprar por WhatsApp
                        </button>
                    </div>
                `;

                            
                            container.appendChild(card);

                            // Agregar evento al botón de WhatsApp
                            document.getElementById('wa-' + item['Código']).addEventListener('click', function() {
                                window.open(generarLinkWhatsapp(item), '_blank');
                            })
    });
    
    console.log("¡Proceso de renderizado!");
    }

// Esta función se activa cuando haces clic en cualquier botón del menú
function filtrarPorCategoria(categoria) {
    console.log("Filtrando por:", categoria);

    // 1. Filtramos el array serviciosData que ya tiene la info de Supabase
    const filtrados = serviciosData.filter(item => {
        return item['Categoría'] === categoria;
    });

    // 2. Si la categoría existe, redibujamos las tarjetas con el filtro
    if (filtrados.length > 0) {
        renderCards(filtrados);
    }
}

//4. Lógica del Buscador (Filtro en tiempo real)
buscador.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtrados = serviciosData.filter(s => s.Servicio.toLowerCase().includes(query) || s.Categoría.toLowerCase().includes(query)
    );
    renderCards(filtrados);
});

//Nueva función para manejar el inicio de sesión
async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    //Intentar iniciar sesión con Supabase
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        alert("Acceso denegado: " + error.message);
    } else {
        console.log("Sesión iniciada con éxito");

        //Ocultar el formulario de login y mostrar el contenido principal
        document.getElementById('auth-container').style.display = 'none';

        //Mostrar el buscador y el contenedor de servicios
        document.getElementById('main-content').style.display = 'block';

        //Ahora sí, cargar los servicios
        getServicios();
    }
} 

// Función para cambiar de la vista al login de vendedores
function mostrarLogin() {
    const seccionPublica = document.getElementById('seccion-publica');
    const authContainer = document.getElementById('auth-container');
    const btnVendedores = document.querySelector('.btn-acceso-vendedores');

    // Si los encuentra, aplica los cambios de estilos de forma segura
    if (seccionPublica) {
        seccionPublica.style.display = 'none';
    }
    if (authContainer) {
        authContainer.style.display = 'flex';
    }
    if (btnVendedores) {
        btnVendedores.style.display = 'none';
    }
}

//Función para filtrar lo que ven los clientes finales

function filtrarVitrinaPublica(categoriaABuscar) {
    // serviciosData es la variable global con todos los datos
    if (!serviciosData || serviciosData.length === 0) return;

    // Filtramos comparando con el nombre exacto de la columna en Supabase
    const filtrados = serviciosData.filter(servicio =>servicio['Categoría'] === categoriaABuscar);

    renderizarVitrinaPublica(filtrados);
}

function buscarServiciosPublicos() {
    const textoBuscado = document.getElementById('buscador-publico').value.toLowerCase();

    const resultadosFiltrados = serviciosData.filter(servicio =>
    servicio.Servicio.toLowerCase().includes(textoBuscado)
    );
    
    renderizarVitrinaPublica(resultadosFiltrados);
    }


// Función para renderizar los servicios al cliente final
function renderizarVitrinaPublica(servicios) {
    const contenedorPublico = document.getElementById('grid-clientes');

    if (!contenedorPublico) {
        console.error("No se encontró el grid-clientes en el HTML");
        return;
    }

    // Limpiamos el contenedor antes de agregar nada 
    contenedorPublico.innerHTML = '';

    // Si no hay servicios cargados
    if (servicios.length === 0) {
        contenedorPublico.innerHTML = '<p style="color: white; text-align: center;">Cargando catálogo premium...</p>';
        return;
    }

    // Recorremos la base de datos y creamos una tarjeta pública por cada servicio
    servicios.forEach(servicio => {
        const nombre = servicio.Servicio || 'Servicio Premium';
        const precio = servicio['Precio Cliente'] || '0';
        const tipo = servicio['Categoría'] || servicio.Categoria || 'Pantalla Individual';
        const urlImagen = servicio.Imagen_URL || 'https://via.placeholder.com/80?text=Logo'; 

        let claseColor ='';
        if (tipo === 'Individual') {
            claseColor = 'btn-individual';
        } else if (tipo === 'Dúos') {
            claseColor = 'btn-duo';
        } else if (tipo === 'Tríos') {
            claseColor = 'btn-trio';
        } else if (tipo === 'Combos Especiales') {
            claseColor = 'btn-combo';
        }

        // Lógica para determinar el badge de disponibilidad
        let badgeDisponibilidad = '';

        // Solo si es categoría 'Individual' y existe la columna 'Disponibilidad_servicio'
        if (tipo === 'Individual' && servicio.Disponibilidad_servicio) {
            let claseEstado = '';
            const estadoDisponibilidad = servicio.Disponibilidad_servicio.toLowerCase();

            if (estadoDisponibilidad === 'disponible') claseEstado = 'verde';
            else if (estadoDisponibilidad === 'encargar') claseEstado = 'amarillo';
            else claseEstado = 'rojo';

            badgeDisponibilidad = `<span class="badge-disponibilidad ${claseEstado}">${servicio.Disponibilidad_servicio.toUpperCase()}</span>`;
        }

        // Formatear el precio para que se vea como moneda (ej: 15.000)
        const precioFormateado = new Intl.NumberFormat('es-CO').format(precio);

        const tarjetaHTML = `<div class="card-publica">
            ${badgeDisponibilidad}
            <img src="${urlImagen}" alt="Logo de ${nombre}" class="logo-servicio-publico">
            <h3>${nombre}</h3>
            <p class="tipo-cuenta tag-categoria ${claseColor}">${tipo}</p> 

            ${servicio['Ahorro'] > 0 ? `<p class="badge-ahorro">Ahorras: $${new Intl.NumberFormat('es-CO').format(servicio['Ahorro'])} 🤑</p>` : ''}

            <div class="precio-destacado">
                <span class="moneda">$</span>${precioFormateado} <span class="mes">/ mes</span>
                </div>

                <button class="btn-comprar-whatsapp" onclick="comprarPorWhatsapp('${nombre}', '${servicio.Disponibilidad_servicio}')">
                    <i class="fab fa-whatsapp"></i> Pedir Ahora
                </button>
            </div>
            `;

            // Agregamos la tarjeta al HTML
            contenedorPublico.innerHTML += tarjetaHTML;
    });
} 

// Función para el botón de whatsapp público
function comprarPorWhatsapp(nombreServicio, estadoDisponibilidad) {
    const numeroWhatsapp = "573158643093";

    const mensajeCliente = `Hola, me gustaría adquirir el servicio de "${nombreServicio}". ¿Cómo es el proceso para realizar la compra? ¡Gracias!`;

    const linkCliente = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensajeCliente)}`;

    window.open(linkCliente, '_blank');
}

async function mostrarVentaReciente() {
    // Consultamos la última venta de Supabase 
    const { data, error } = await supabaseClient
    .from('Ventas') 
    .select('nombre_perfil, servicio_nombre')
    .order('created_at', { ascending: false }) // La más nueva primero
    .limit(16); 

    if (error) {
        console.error("Error al obtener venta:", error);
        return;
    }

if (data && data.length > 0) {
    const indiceAleatorio = Math.floor(Math.random() * data.length);
    const venta = data[indiceAleatorio];
    const caja = document.getElementById('notificacion-venta');
    const texto = document.getElementById('texto-venta');

    // Cambiamos el mensaje
    texto.innerText = `¡${venta.nombre_perfil} acaba de comprar ${venta.servicio_nombre}!`;

    // Mostramos la notificación
    caja.style.display = 'block';

    // La ocultamos después de 5 segundos
    setTimeout(() => { caja.style.display = 'none'; }, 5000);
    }
}

// LLamamos a la función cada 10 segundos para que sea dinámico
setInterval(mostrarVentaReciente, 10000); 

// Iniciar carga
getServicios();

// Actualizar el año en el footer automáticamente
document.getElementById("year").textContent = new Date().getFullYear();