require('module-alias/register')
require('dotenv').config()
import DatabaseHelper from '../infra/database/postgres/helpers/postgres-helper'

DatabaseHelper.connect()
