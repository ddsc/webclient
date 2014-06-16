from fabric.context_managers import cd
from sitesetup.fab.config import config, production_config
from fabric.decorators import task
from fabric.contrib.files import exists
from fabric.operations import sudo

from sitesetup.fab.config import init_file
from sitesetup.fab import detail
from sitesetup.fab.tasks import staging, production

# Most settings can be configured in fabfile.cfg
init_file('fabfile.cfg')

@task
def init():
    detail.initial_create_srv_dir()
    detail.switch_and_buildout()
    detail.initial_nginx_symlinks()


@task
def build_js_dist():
    if not exists(config('basedir')):
        print("Directory %s doesn't exist yet" % config('basedir'))
        print("Run fabric with the 'create_srv_dir' command.")
    with cd(config('basedir')):
    # sudo('cd /srv/test.dijkdata.nl', user='buildout')
        sudo('npm install', user='buildout')
        sudo('grunt build', user='buildout')

@task
def update():
    build_js_dist()
    detail.switch_and_buildout()
