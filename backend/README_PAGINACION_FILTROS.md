# Paginación y Filtros - API Ecomed

## Descripción
Este documento describe cómo usar la funcionalidad de paginación y filtros implementada en los endpoints de Clientes y Manifiestos.

## Endpoints con Paginación y Filtros

### 1. Clientes
- **GET** `/api/clientes` - Lista paginada con filtros
- **GET** `/api/clientes/filters` - Opciones de filtros disponibles

### 2. Manifiestos
- **GET** `/api/manifiestos` - Lista paginada con filtros
- **GET** `/api/manifiestos/filters` - Opciones de filtros disponibles

## Parámetros de Paginación

### Parámetros Básicos
| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Número de página |
| `limit` | integer | 10 | Elementos por página |

### Parámetros de Ordenamiento
| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `sortBy` | string | created_at | Campo por el cual ordenar |
| `sortOrder` | string | DESC | Orden (ASC/DESC) |

## Filtros por Endpoint

### Clientes (`/api/clientes`)

#### Filtros de Búsqueda
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `search` | string | Búsqueda general en: número de registro, razón social, correo, teléfono |
| `zona` | string | Filtrar por zona geográfica |
| `delegacion` | string | Filtrar por delegación |
| `estado` | string | Filtrar por estado |
| `id_destino` | integer | Filtrar por ID de destino |
| `id_transportista` | integer | Filtrar por ID de transportista |

#### Campos de Ordenamiento (sortBy)
- `id`
- `numero_registro_ambiental`
- `nombre_razon_social`
- `zona`
- `delegacion`
- `estado`
- `created_at`
- `updated_at`

### Manifiestos (`/api/manifiestos`)

#### Filtros de Búsqueda
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `search` | string | Búsqueda general en número de libro |
| `numero_libro` | string | Filtrar por número de libro específico |
| `id_cliente` | integer | Filtrar por ID de cliente |
| `id_destino` | integer | Filtrar por ID de destino del cliente |
| `id_transportista` | integer | Filtrar por ID de transportista del cliente |
| `fecha_inicio` | date | Filtrar por fecha de creación desde |
| `fecha_fin` | date | Filtrar por fecha de creación hasta |

#### Campos de Ordenamiento (sortBy)
- `id`
- `numero_libro`
- `created_at`
- `updated_at`

## Ejemplos de Uso

### 1. Paginación Básica
```bash
# Obtener primera página con 10 elementos
GET /api/clientes?page=1&limit=10

# Obtener segunda página con 20 elementos
GET /api/clientes?page=2&limit=20
```

### 2. Búsqueda y Filtros
```bash
# Búsqueda general
GET /api/clientes?search=industrial

# Filtrar por zona
GET /api/clientes?zona=norte

# Filtrar por múltiples criterios
GET /api/clientes?zona=norte&delegacion=cuauhtemoc&id_destino=1
```

### 3. Ordenamiento
```bash
# Ordenar por nombre ascendente
GET /api/clientes?sortBy=nombre_razon_social&sortOrder=ASC

# Ordenar por fecha de creación descendente
GET /api/clientes?sortBy=created_at&sortOrder=DESC
```

### 4. Filtros de Fecha (Manifiestos)
```bash
# Filtrar por rango de fechas
GET /api/manifiestos?fecha_inicio=2024-01-01&fecha_fin=2024-12-31

# Filtrar desde una fecha
GET /api/manifiestos?fecha_inicio=2024-06-01
```

### 5. Combinación Completa
```bash
GET /api/clientes?page=1&limit=15&search=industrial&zona=norte&sortBy=nombre_razon_social&sortOrder=ASC
```

## Respuesta de Paginación

### Estructura de Respuesta
```json
{
  "success": true,
  "data": [...], // Array de elementos
  "pagination": {
    "total": 150,           // Total de elementos
    "totalPages": 10,       // Total de páginas
    "currentPage": 1,       // Página actual
    "limit": 15,           // Elementos por página
    "hasNextPage": true,    // ¿Hay página siguiente?
    "hasPrevPage": false,   // ¿Hay página anterior?
    "nextPage": 2,         // Número de página siguiente
    "prevPage": null       // Número de página anterior
  },
  "filters": {
    "search": "industrial",
    "zona": "norte",
    "sortBy": "nombre_razon_social",
    "sortOrder": "ASC"
  }
}
```

## Endpoints de Filtros

### Clientes (`/api/clientes/filters`)
```json
{
  "success": true,
  "data": {
    "zonas": ["Zona Norte", "Zona Sur", "Zona Este", "Zona Oeste"],
    "delegaciones": ["Cuauhtémoc", "Tlalpan", "Iztapalapa"],
    "estados": ["CDMX", "Estado de México"],
    "destinos": [
      {
        "id": 1,
        "nombre": "Centro de Disposición",
        "razon_social": "Empresa A"
      }
    ],
    "transportistas": [
      {
        "id": 1,
        "razon_social": "Transportes B",
        "placa": "ABC-123"
      }
    ]
  }
}
```

### Manifiestos (`/api/manifiestos/filters`)
```json
{
  "success": true,
  "data": {
    "clientes": [
      {
        "id": 1,
        "nombre_razon_social": "Empresa Industrial",
        "numero_registro_ambiental": "RAMA-001-2024"
      }
    ],
    "destinos": [...],
    "transportistas": [...],
    "residuos": [
      {
        "id": 1,
        "nombre": "Aceite usado",
        "descripcion": "Aceite lubricante usado"
      }
    ]
  }
}
```

## Mejores Prácticas

### 1. Límites de Paginación
- **Recomendado**: 10-50 elementos por página
- **Máximo**: 100 elementos por página
- **Mínimo**: 1 elemento por página

### 2. Optimización de Consultas
- Usar filtros específicos en lugar de búsqueda general cuando sea posible
- Combinar múltiples filtros para reducir resultados
- Usar índices en campos de búsqueda frecuente

### 3. Manejo de Errores
```bash
# Parámetros inválidos
GET /api/clientes?page=0&limit=1000
# Respuesta: 400 Bad Request

# Página inexistente
GET /api/clientes?page=999
# Respuesta: 200 con array vacío
```

### 4. URLs Amigables
```bash
# Construir URLs con parámetros
const url = new URL('/api/clientes', baseURL);
url.searchParams.set('page', '1');
url.searchParams.set('limit', '20');
url.searchParams.set('search', 'industrial');
url.searchParams.set('sortBy', 'nombre_razon_social');
url.searchParams.set('sortOrder', 'ASC');
```

## Implementación en Frontend

### JavaScript/Fetch
```javascript
async function getClientes(filters = {}) {
  const params = new URLSearchParams();
  
  // Parámetros de paginación
  params.set('page', filters.page || 1);
  params.set('limit', filters.limit || 10);
  
  // Filtros
  if (filters.search) params.set('search', filters.search);
  if (filters.zona) params.set('zona', filters.zona);
  if (filters.delegacion) params.set('delegacion', filters.delegacion);
  
  // Ordenamiento
  if (filters.sortBy) params.set('sortBy', filters.sortBy);
  if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);
  
  const response = await fetch(`/api/clientes?${params}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
}

// Uso
const result = await getClientes({
  page: 1,
  limit: 20,
  search: 'industrial',
  zona: 'norte',
  sortBy: 'nombre_razon_social',
  sortOrder: 'ASC'
});

console.log('Datos:', result.data);
console.log('Paginación:', result.pagination);
console.log('Filtros aplicados:', result.filters);
```

### React Hook
```javascript
import { useState, useEffect } from 'react';

function usePaginatedData(endpoint, filters = {}) {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (newFilters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: newFilters.page || 1,
        limit: newFilters.limit || 10,
        ...newFilters
      });

      const response = await fetch(`${endpoint}?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
        setPagination(result.pagination);
        setError(null);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(filters);
  }, [endpoint, JSON.stringify(filters)]);

  return { data, pagination, loading, error, refetch: fetchData };
}

// Uso en componente
function ClientesList() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    zona: ''
  });

  const { data, pagination, loading, error, refetch } = usePaginatedData('/api/clientes', filters);

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {/* Filtros */}
      <FilterControls onFilterChange={handleFilterChange} />
      
      {/* Lista de datos */}
      <DataList data={data} />
      
      {/* Paginación */}
      <Pagination 
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
```

## Notas Importantes

1. **Rendimiento**: Los filtros se aplican a nivel de base de datos para optimizar el rendimiento
2. **Seguridad**: Todos los parámetros se validan y sanitizan
3. **Compatibilidad**: Los endpoints mantienen compatibilidad hacia atrás
4. **Caché**: Considerar implementar caché para consultas frecuentes
5. **Monitoreo**: Monitorear el rendimiento de consultas complejas

## Troubleshooting

### Problemas Comunes

1. **Página no encontrada**: Verificar que `page` sea mayor a 0
2. **Límite excesivo**: Reducir el valor de `limit`
3. **Filtros no funcionan**: Verificar nombres de parámetros
4. **Ordenamiento incorrecto**: Verificar valores de `sortBy` y `sortOrder`

### Debugging
```bash
# Verificar respuesta completa
curl -H "Authorization: Bearer TOKEN" "http://localhost:3000/api/clientes?page=1&limit=5&search=test"

# Verificar filtros disponibles
curl -H "Authorization: Bearer TOKEN" "http://localhost:3000/api/clientes/filters"
``` 