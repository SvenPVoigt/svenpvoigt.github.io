---
layout: tutorials
title: Linux operating on files
description: Life hacks for file operations with bash.
complete: False
cheatsheet: True
---

# The intermediate bash guide for those who mastered the basics and now need productivity hacks

# Looping over files

Using glob works in current directory: `for file in pattern; do something; done`

Turn on globstar for recursive: `shopt -s globstar`. Then iterate recursively like: `for file in **/*.ext;`

Can also use find with loop or xargs (credit https://stackoverflow.com/users/900873/kevin):
```
find . -name '*.txt' -print0 | 
    while IFS= read -r -d '' line; do 
        process "$line"
    done
```

```
# using xargs*
find . -name \*.txt -print0 | xargs -0 process

# using xargs with arguments after each filename (implies one run per filename)
find . -name \*.txt -print0 | xargs -0 -I{} process {} argument
```

# Renaming a file with - something in a cool one liner

`for file in *.ttf; do mv $file "${file/-*.ttf/.ttf}"; done`

So for example, if a file is called `hi-01.ttf` the result of this is that it changed to `hi.ttf`. And this is done for all files that follow the - something .ttf (`-*.ttf`) pattern.


# Get line number where grep finds match

grep -n "vsftpd" .bash_history



# zip command

Zip a folder: `zip -q -r destination source` OR `zip -q destination source/*`

unzip a folder: `unzip source`

Zip a folder into chunks: `zip -q -r -s 4000M destination source`

Unzip multipart folder: 
```
zip -s 0 split.zip --out single.zip
OR?
zip -F source.zip --out source-joined.zip
unzip source-joined.zip
```

# Output lines i thru j to terminal
sed -n 1400,1800p .bash_history

## With an optional match
-A 5  # this will give you 5 lines after searched string.
-B 5  # this will give you 5 lines before searched string.
-C 5  # this will give you 5 lines before & after searched string

grep -C 15 "qlever" ~/.bash_history


# Check if file signed by keys
gpg --import apache-netbeans_20-1_all.deb.sha512 
gpg --import KEYS
gpg --import KEYS.txt
gpg --verify apache-netbeans_20-1_all.deb.asc apache-netbeans_20-1_all.deb


# Encrypt a file
Encrypt with symmetric password: `gpg -c filename`
Decrypt with same password: `gpg filename`


# Check file metadata and delete if needed
Check metadata: `exiftool filename`
Delete metadata: `exiftool -all= filename`

# Scrub metadata from pdf file
exiftool -all:all= foo.pdf
qpdf --linearize foo.pdf bar.pdf

# Compute Hashsums
sha256sum oldFile > oldFile.sha256

# Compare Hashsums
echo "$(cat oldFile.sha256) newFile" | sha256sum --check


# Shell script to scrape Zotero and generate hashes for content

# Shell script to compare hashes
```
for file in $(ls path/to/pdfs/to/evaluate); do
    # Create a tmp pdf
    exiftool -all:all= foo.pdf
    qpdf --linearize foo.pdf bar.pdf
    
    # Hash it
    fileHash=$(sha256sum bar.pdf)
    
    for zHash in $(ls path/to/Zotero/hashes); do
        if [ $fileHash = $(cat zHash) ]; then
            # continue
        else
            # copy pdf to library and add a hash to path/to/Zotero/nextHashes
        fi
    done
    
    # copy from path/to/Zotero/nextHashes to path/to/Zotero/hashes
done
```


# Print the number of pages of all pdfs in directory

`for i in *.pdf; do echo "$i"; pdfinfo "$i" | awk '/^Pages:/'; done`

# Joining PDFs

Join PDFs in alphabetical order

```
#!/bin/bash

# Define the output filename
output_file=${PWD##*/}

# Create an array of sorted PDF files
mapfile -t pdf_files < <(ls *.pdf | sort)

echo "${pdf_files[@]}"

# Merge PDFs with qpdf, expanding the array with double quotes around each element
qpdf --empty --pages "${pdf_files[@]}" -- "$output_file".pdf
```

Join PDFs in order of download date

```
# Credit https://unix.stackexchange.com/questions/549922/bash-how-to-move-and-rename-a-file-in-the-order-of-oldest-to-newest

mkdir renamed;

i=0;

for f in $(ls -rt *.pdf); do
  i=$((i+1));
  cp "$f" "renamed/$(printf %04d $i).pdf";
done

pushd renamed;

pdftk *.pdf cat output ../merged.pdf;

popd;

rm -r renamed;
```



# How to use find

find files `find -type f` 

find directories `find -type d`

 find and move files `find -type f -exec {} . \;` where {} is replaced by the found names and \; ends the exec command.
