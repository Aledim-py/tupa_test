import os

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

def deleteFile(file_name: str):
    print("Deleting this shit %s" % file_name)
    if os.path.isfile(file_name):
        os.remove(file_name)
    else:    ## Show an error ##
        print("Error: %s file not found" % file_name)
