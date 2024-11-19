# Various variables:
SRCDIR	:= public/
TGTDIR	:= build/
# ---
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

all: initialmsg $(TGTDIR) $(HTMLTGT)
	@printf "$(GREEN)\t~ Done building$(RESET)\n"

initialmsg:
	@printf "Building site files...\n"

# Copies all files of SRCDIR into TGTDIR, only overwrites modified files
$(TGTDIR):
	@printf "$(BLUE)Moving everything into the $(TGTDIR) directory...$(RESET)\n"
	@cp -rfTu $(SRCDIR) $(TGTDIR)

# Edits changed html files to put their date of modification in __LAST_UPDATED__
$(HTMLTGT): $(TGTDIR)%.html: $(SRCDIR)%.html
	@if grep -q __LAST_UPDATED__ $@; then\
		sed -i "s|__LAST_UPDATED__|$(shell date -r $< +'%Y/%m/%d')|g" $@;\
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

.PHONY: all clean colortest $(TGTDIR) $(HTMLTGT)