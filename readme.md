# DATABASE HANDLER PARA IONIC 2

Para utilizar la librería se deben efectuar los siguientes pasos:

- Instalar el plugin cordova-sqlite-storage:

```
ionic cordova plugin add cordova-sqlite-storage
npm install --save @ionic-native/sqlite
```

- En el archivo package.json incluir la libreria y ejecutar `npm install`
```
...
"@4r/database": "github:4rsoluciones/database"
...
```

- Incluir las librerías en la declaración del módulo app:

/app/app.module.ts
```
import { SQLite } from "@ionic-native/sqlite";
import { Database } from "@4r/database/database";

@NgModule({
	...
    providers: [
		SQLite,
		Database
    ]
	...
})
```

- Crear una clase que extienda el servicio base de la siguiente manera:

```
import {DatabaseHandler, Table} from "@4r/database/database";
import {SQLite} from "@ionic-native/sqlite";

@Injectable()
export class Database extends DatabaseHandler {

  constructor(platform: Platform, sqlite: SQLite) {

    let tables: Table[] = [
		{
		  name: 'table1',
		  fields: 'id integer PRIMARY KEY, title text'
		}, {
		  name: 'table2',
		  fields: 'id integer PRIMARY KEY, title text, description text, id_table1 integer, FOREIGN KEY(id_table1) REFERENCES table1(id)'
		}
	];
  
	super(platform, sqlite, tables);
  }

  myCustomMethod(): Promise<myObject[]> {
    return new Promise((resolve, reject) => {})
  }

}
```

- Recordar que para que compile las dependencia propias (librerías de 4r) se debe modificar eel archivo *tsconfig.json*:
```
...
"include": [
    "src/**/*.ts",
    "node_modules/@4r/**/*.ts"
  ],
  "exclude":[
    "/node_modules(?!(\/|\\)@4r)/"
  ],
  ...
]
...
```
