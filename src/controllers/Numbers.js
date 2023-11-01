import { resolve } from 'node:path';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import dotenv from 'dotenv';

dotenv.config();

const file = resolve('db.json');
const adapter = new JSONFile(file);
const defaultData = { numbers: [] };
const db = new Low(adapter, defaultData);

class NumbersController {
  async store(req, res) {
    try {
      await db.read();
      const numbers = db.data.numbers;
      const date = new Date();
      const dateNow = `${(date.getDate() < 10) ? ("0" + date.getDate()) : (date.getDate())}/${((date.getMonth() + 1) < 10) ? ("0" + (date.getMonth() + 1)) : ((date.getMonth() + 1))}/${date.getFullYear()} - ${(date.getHours() < 10) ? ("0" + date.getHours()) : (date.getHours())}:${(date.getMinutes() < 10) ? ("0" + date.getMinutes()) : (date.getMinutes())}`;
      if (numbers) {
        for (let number of numbers) {
          if (number.id === req.body.number){
            if (!number.name) {
              number.name = req.body.name;
              number.registAt = dateNow;
              number.updatedAt = dateNow;
              db.write();
              const { id, name, registAt, updatedAt } = number;
              return res.status(201).json({ id, name, registAt, updatedAt });
            }
            return res.status(401).json({
              errors: ['Number already registred']
            })
          }
        }
      }
      const newNumber = {
        id: req.body.number,
        name: req.body.name,
        registAt: dateNow,
        updatedAt: dateNow
      };
      db.data.numbers.push(newNumber);
      db.write();
      const { id, name, registAt, updatedAt } = newNumber;
      return res.status(201).json({ id, name, registAt, updatedAt });
    } catch (e) {
      return res.status(400).json({
        errors: ['Data could not be stored'],
      });
    }
  }

  async index(req, res) {
    try {
      await db.read();
      const numbers = db.data.numbers;
      const validNumbers = (
        numbers
        .filter((number) => number.name !== null)
      );
      if (validNumbers) return res.status(200).json(validNumbers);
      return res.status(200).json([]);
    } catch (e) {
      return res.status(400).json({
        errors: ['Data could not be found'],
      });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          errors: ['ID Missing'],
        });
      }

      await db.read();
      const numbers = db.data.numbers;
      let number = null;
      for (let numberI of numbers) {
        if (numberI.id == id) number = numberI;
      }
      if (!number) {
        return res.status(400).json({
          errors: ['Unregistered number'],
        });
      }
      return res.status(200).json(number);
    } catch (e) {
      return res.status(400).json({
        errors: ['Data could not be found'],
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          errors: ['ID missing'],
        });
      }

      await db.read();
      const numbers = db.data.numbers;
      let number = null;
      for (let numberI of numbers) {
        if (numberI.id == id) number = numberI;
      }
      if (!number) return res.status(400).json({ errors: ["Unregistered number"] });
      const date = new Date();
      const dateNow = `${(date.getDate() < 10) ? ("0" + date.getDate()) : (date.getDate())}/${((date.getMonth() + 1) < 10) ? ("0" + (date.getMonth() + 1)) : ((date.getMonth() + 1))}/${date.getFullYear()} - ${(date.getHours() < 10) ? ("0" + date.getHours()) : (date.getHours())}:${(date.getMinutes() < 10) ? ("0" + date.getMinutes()) : (date.getMinutes())}`;
      number.name = req.body.name;
      number.updatedAt = dateNow;
      db.write();
      const { name, updatedAt } = number;
      return res.status(200).json({ name, updatedAt });
    } catch (e) {
      return res.status(400).json({
        errors: ['Data could not be found'],
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          errors: ['ID missing'],
        });
      }

      await db.read();
      const numbers = db.data.numbers;
      for (let numberI of numbers) {
        if (numberI.id == id) {
          const numberDeleted = {
            id: numberI.id,
            name: numberI.name,
            registAt: numberI.registAt,
            updatedAt: numberI.updatedAt,
          };
          numberI.name = null;
          numberI.registAt = null;
          numberI.updatedAt = null;

          db.write();
          return res.status(200).json(numberDeleted);
        }
      }

      return res.status(400).json({
        errors: ['Unregistered number'],
      });
    } catch (e) {
      return res.status(400).json({
        errors: ['Data could not be found'],
      });
    }
  }
}

export default new NumbersController();