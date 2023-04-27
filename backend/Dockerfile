FROM python:3.9

# 
WORKDIR /backend

# 
COPY . .

# 
RUN pip install --no-cache-dir --upgrade -r /backend/requirements.txt

# 
CMD ["bash",  "/backend/run.sh"]