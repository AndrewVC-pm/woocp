1) давай называть этот проект и решение - woocp, чтобы удобно понимать про что мы говорим
2) я немного не понимаю как деплоить и не будет ли ошибок - перепиши деплой с учетом того что сейчас это решение лежит на моем локальном компьютере, а я буду переносить этот woocp на сервер через github, вот "https://github.com/flyokyla/billing" мой репозиторий на github .
3) еще сейчас на сервере, на котором я буду это деплоить, уже запущено несколько docker контейнеров :
```
CONTAINER ID   IMAGE                                   COMMAND                  CREATED        STATUS                 PORTS                                                             NAMES
0ea80087a1e9   casbin/casdoor:2.324.0                  "/server"                7 days ago     Up 7 days              127.0.0.1:8000->8000/tcp                                          evc-casdoor
5b85af98c9f0   mysql:8.0                               "docker-entrypoint.s…"   2 weeks ago    Up 2 weeks (healthy)   3306/tcp, 33060/tcp                                               casdoor-vc-mysql-1
57c7d80c8af7   open-webui:v0.7.2                       "bash start.sh"          4 weeks ago    Up 2 weeks (healthy)   0.0.0.0:3000->8080/tcp, [::]:3000->8080/tcp                       open-webui
0445f6f1ba06   open-webui:EVC_v0_6_26                  "bash start.sh"          4 months ago   Up 2 weeks (healthy)   0.0.0.0:3001->8080/tcp, [::]:3001->8080/tcp                       evc-owui
ff9ba112c9d2   variantconst/openwebui-monitor:latest   "docker-entrypoint.s…"   7 months ago   Up 2 weeks             0.0.0.0:7878->3000/tcp, [::]:7878->3000/tcp                       openwebui-monitor
84711f800b8c   portainer/portainer-ce:latest           "/portainer"             7 months ago   Up 2 weeks             8000/tcp, 9443/tcp, 0.0.0.0:9000->9000/tcp, [::]:9000->9000/tcp   portainer
ace852ab9b1e   ghcr.io/open-webui/pipelines:main       "bash start.sh"          7 months ago   Up 2 weeks             0.0.0.0:9099->9099/tcp, [::]:9099->9099/tcp                       pipelines

``` - не будет ли конфликтов

