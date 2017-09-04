import {SQLite, SQLiteObject} from "@ionic-native/sqlite";
import {Injectable} from "@angular/core";

export interface Table {
  name: string;
  fields: string;
}

@Injectable()
export class DatabaseHandler {
  dbName: string = 'myDB.db';
  db: SQLiteObject = null;

  constructor(public sqlite: SQLite, public tables: Table[]) {
    this.init()
  }

  init(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.sqlite.create({
        name: this.dbName,
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.db = db;
          resolve(this.createAllTablesIfNotExists());
        })
        .catch(error => {
          console.log(error);
          reject(error);
        })
    });
  }

  createAllTablesIfNotExists(): Promise<any> {
    let promises: Promise<any>[] = [];
    for (let i = 0; i < this.tables.length; i++) {
      promises.push(this.createTableIfNotExists(this.tables[i].name, this.tables[i].fields));
    }
    return Promise.all(promises);
  }

  createTableIfNotExists(table, attr) {
    return this.db.executeSql(`CREATE TABLE IF NOT EXISTS ${table} (${attr})`, {});
  }

  saveData(table: string, atrr: string, values: any): Promise<any> {
    let valuesArray = [];
    for (let key of atrr.split(',')) {
      valuesArray.push(values[key]);
    }
    return this.db.executeSql(`INSERT INTO ${table} (${atrr}) VALUES(${'?,'.repeat(atrr.split(',').length).slice(0, -1)})`, valuesArray);
  }

  saveDataBatch(table: string, atrr: string, values: any): Promise<any> {
    let valuesArray: Array<Array<any>> = [];
    for (let i = 0; i < values.length; i++) {
      let aux: Array<any> = [];
      for (let key of atrr.split(',')) {
        aux.push(values[i][key]);
      }
      valuesArray.push(aux);
    }
    let queryArray: Array<any> = [];
    for (let i = 0; i < valuesArray.length; i++) {
      queryArray.push([
        `INSERT INTO ${table} (${atrr}) VALUES(${'?,'.repeat(atrr.split(',').length).slice(0, -1)})`,
        valuesArray[i]
      ])
    }
    return this.db.sqlBatch(queryArray);
  }

  getAllData(table) {
    return this.db.executeSql(`SELECT * FROM ${table}`, {});
  }

  getData(params = '*', table, atrr, data) {
    return this.db.executeSql(`SELECT ${params} FROM ${table} WHERE ${atrr} == '${data}'`, {});
  }

  clearTable(table: string) {
    return this.db.executeSql("DELETE FROM " + table, {});
  }

  clearTables(tables: string[]): Promise<any> {
    let promises: Promise<any>[] = [];
    for (let i = 0; i < tables.length; i++) {
      promises.push(this.clearTable(tables[i]));
    }
    return Promise.all(promises);
  }

  clearAll() {
    let promises: Promise<any>[] = [];
    for (let i = 0; i < this.tables.length; i++) {
      promises.push(this.clearTable(this.tables[i].name));
    }
    return Promise.all(promises);
  }

}
