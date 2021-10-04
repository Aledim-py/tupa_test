#!/usr/bin/python

import os
from argparse import ArgumentParser
from subprocess import run

def startDB():
    # p = run(["systemctl", "start", "mariadb"], capture_output=True, shell=True)
    os.system("systemctl start mariadb")
    # output = p.stdout.decode('utf-8')

def startDjango():
    os.system("python manage.py runserver")
    # run(["python", "manage.py", "runserver"])
    
def start():
    startDB()
    startDjango()

# Run when there are changes made to the models
def makeMigration(arg):
    run(["python", "manage.py", "makemigrations", arg])

def migrate():
    os.system('python manage.py migrate')

def showSQL(arg):
    os.system("python manage.py sqlmigrate " + " ".join(arg) + " > %s/migrations/%s.sql" %
            (arg[0],arg[1]) )

if __name__ == "__main__":
    RUNABLE_SCRIPTS = ('startDB', 'startDjango', 'start', 'makeMigration', 'showSQL', 'migrate')

    parser = ArgumentParser()
    parser.add_argument('cmd', nargs=1, choices=RUNABLE_SCRIPTS)
    parser.add_argument('app', nargs='?')
    options = parser.parse_args()

    if options.app is not None:
        eval(options.cmd[0])(options.app)
    else:
        eval(options.cmd[0])()



