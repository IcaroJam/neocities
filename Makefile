# Various variables:
SRCDIR	:= public/
TGTDIR	:= build/
# ---
MODATES := $(SRCDIR)modDates.yml
HTMLSRC	:= $(shell find $(SRCDIR) -name "*.html") # Finds all html files inside the SRCDIR
HTMLTGT	:= $(addprefix $(TGTDIR), $(HTMLSRC:$(SRCDIR)%=%)) # Defines the new paths in TGTDIR for the html files
####################

# Printing format helpers:
RED		:= \033[38;5;1m
BLUE	:= \033[38;5;6m
GREEN	:= \033[38;5;35m
YELLOW	:= \033[38;5;11m
RESET	:= \033[0m
##########################

all: initialmsg upDate libSort deploy
	@printf "$(GREEN)\t~ Done building$(RESET)\n"

initialmsg:
	@printf "Building site files...\n"

# Stores the modification dates of files in a yaml so it can be used during deploy
upDate:
	@echo "Skipping auto upDate"
# @rm -f $(MODATES)
# @for f in $(HTMLSRC); do\
# 	date=$$(date -r $$f +'%Y/%m/%d');\
# 	echo "$$f: $$date" >> $(MODATES);\
# done

libSort:
	@echo "Sorting library archives..."
	@node scripts/libraryArchiveSort.js
	@echo "All archives sorted!"

deploy: $(TGTDIR) $(HTMLTGT)

# Copies all files of SRCDIR into TGTDIR, only overwrites modified files
$(TGTDIR):
	@printf "$(BLUE)Moving everything into the $(TGTDIR) directory...$(RESET)\n"
	@cp -rfTu $(SRCDIR) $(TGTDIR)

# Edits changed html files to put their date of modification in __LAST_UPDATED__
$(HTMLTGT): $(TGTDIR)%.html: $(SRCDIR)%.html
	@if grep -q __LAST_UPDATED__ $@; then\
		date=$$(grep $< $(MODATES) | sed 's/.* //');\
		sed -i "s|__LAST_UPDATED__|$$date|g" $@;\
		printf "$(YELLOW)Build date updated for $@ !$(RESET)\n";\
	fi

colortest:
	@printf "$(RED)---  red  ---$(RESET)\n"
	@printf "$(BLUE)--- bl ue ---$(RESET)\n"
	@printf "$(GREEN)--- green ---$(RESET)\n"
	@printf "$(YELLOW)---yel low---$(RESET)\n"

clean:
	@rm -rf $(TGTDIR)
	@printf "$(RED)BUILT FILES DELETED$(RESET)\n"

.PHONY: all clean colortest deploy upDate libSort $(TGTDIR) $(HTMLTGT)